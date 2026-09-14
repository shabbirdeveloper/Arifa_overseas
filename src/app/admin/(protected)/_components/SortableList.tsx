'use client';

import { useId, useState, type ReactNode } from 'react';
import { reorderRows, type ReorderableTable } from '../_actions/reorder';
import { IconChevron, IconDown, IconGrip, IconUp } from './icons';

export interface SortableItem {
  id: string;
  title: string;
  /** Second line under the title. */
  subtitle?: string;
  /** Image URL for the leading thumbnail, when the record has one. */
  thumbnail?: string | null;
  badges?: ReactNode;
  body: ReactNode;
}

interface SortableListProps {
  table: ReorderableTable;
  items: SortableItem[];
  /** Shown when there are no items at all. */
  empty?: ReactNode;
}

/**
 * Collapsible record list with drag-and-drop ordering.
 *
 * Two ways to reorder, deliberately: dragging for speed, and up/down buttons
 * that work from the keyboard. Drag-and-drop alone is unusable without a
 * mouse, and this is a tool someone may well operate entirely by keyboard.
 *
 * Order is saved as soon as it changes, and rolled back visually if the write
 * fails, so the list never shows an order the database does not have.
 */
export function SortableList({ table, items, empty }: SortableListProps) {
  const [order, setOrder] = useState(items);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const statusId = useId();

  // Server data wins whenever it changes (after a save, delete or revalidate).
  // Adjusted during render, not in an effect, so the list never paints one
  // frame of stale order after the server sends new rows.
  const [serverItems, setServerItems] = useState(items);
  if (serverItems !== items) {
    setServerItems(items);
    setOrder(items);
  }

  async function persist(next: SortableItem[], previous: SortableItem[]) {
    setOrder(next);
    setSaving(true);
    setStatus('Saving order…');

    const result = await reorderRows(
      table,
      next.map((item) => item.id),
    );

    setSaving(false);

    if (!result.ok) {
      setOrder(previous); // keep the UI honest about what was actually stored
      setStatus(result.message);
      return;
    }

    setStatus('Order saved.');
    window.setTimeout(() => setStatus(''), 2500);
  }

  function move(id: string, direction: -1 | 1) {
    const from = order.findIndex((item) => item.id === id);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= order.length) return;

    const next = [...order];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    void persist(next, order);
  }

  function drop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = order.findIndex((item) => item.id === dragId);
    const to = order.findIndex((item) => item.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...order];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    void persist(next, order);
  }

  if (order.length === 0) return <>{empty}</>;

  return (
    <>
      {status ? (
        <p
          className="adm-meta"
          role="status"
          id={statusId}
          style={{ marginBottom: 8 }}
        >
          {status}
        </p>
      ) : null}

      <div className="adm-list">
        {order.map((item, index) => (
          <details
            key={item.id}
            className={[
              'adm-row',
              dragId === item.id ? 'adm-dragging' : '',
              overId === item.id && dragId !== item.id ? 'adm-drop-target' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onDragOver={(event) => {
              event.preventDefault();
              setOverId(item.id);
            }}
            onDragLeave={() => setOverId((current) => (current === item.id ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              drop(item.id);
              setDragId(null);
              setOverId(null);
            }}
          >
            <summary>
              <span
                className="adm-grip"
                draggable
                role="button"
                tabIndex={-1}
                aria-hidden="true"
                onDragStart={() => setDragId(item.id)}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
                onClick={(event) => event.preventDefault()}
              >
                <IconGrip />
              </span>

              {item.thumbnail !== undefined ? (
                item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="adm-thumb" src={item.thumbnail} alt="" />
                ) : (
                  <span className="adm-thumb adm-thumb-empty" aria-hidden="true">
                    No image
                  </span>
                )
              ) : null}

              <span className="adm-row-main">
                <span className="adm-row-title">{item.title}</span>
                {item.subtitle ? (
                  <span className="adm-row-sub">{item.subtitle}</span>
                ) : null}
              </span>

              <span className="adm-row-meta">
                {item.badges}

                <button
                  type="button"
                  className="adm-btn adm-btn-icon"
                  disabled={index === 0 || saving}
                  aria-label={`Move ${item.title} up`}
                  onClick={(event) => {
                    event.preventDefault();
                    move(item.id, -1);
                  }}
                >
                  <IconUp />
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-icon"
                  disabled={index === order.length - 1 || saving}
                  aria-label={`Move ${item.title} down`}
                  onClick={(event) => {
                    event.preventDefault();
                    move(item.id, 1);
                  }}
                >
                  <IconDown />
                </button>

                <span className="adm-chevron" aria-hidden="true">
                  <IconChevron />
                </span>
              </span>
            </summary>

            <div className="adm-row-body">{item.body}</div>
          </details>
        ))}
      </div>
    </>
  );
}
