import styles from './selectionModal.module.css';
import { modalBuilder } from '../modal/modal';
import React, { useState, useEffect } from 'react';
import Store from 'electron-store';
import Image from 'next/image';

export interface ISelectElement {
  id: string | number,
  title: string,
  description?: string,
  imagePath?: string // TODO: this
}

export interface ISelectionModal {
  items: ISelectElement[],
  prompt: string,
  cancelable: boolean,
  storageKey?: string,
  callback: (response: ISelectElement) => void
}

export default function selectionModal({ items, prompt, cancelable, storageKey, callback }: ISelectionModal): { html: React.ReactElement, show: () => void, hide: () => void } {
  const [selectedItem, setSelectedItem] = useState<ISelectElement>(null);

  const modal = modalBuilder({
    html: (<div className={styles.selectionModal}>
      <h1>{prompt}</h1>
      <div className={styles.itemsBox}>
        {items.map((item, index) => (
          <div key={index} className={[styles.selectionItem, selectedItem?.id === item.id ? styles.selectedItem : ''].join(' ')} onClick={(): void => setSelectedItem(item)}>
            {
              item.imagePath
                ? <div className={styles.selectionItemImageContainer}>
                  <Image src={item.imagePath} alt={item.title} width={500} height={500}/>
                </div>
                : null
            }
            <h1 className={styles.selectionTitle}>{item.title}</h1>
            <div className={styles.selectionDescription}>{item.description}</div>
          </div>
        ))}
      </div>
    </div>),
    submitText: 'Selecionar',
    onSubmit: () => {
      // check if theres an selected item
      if (!selectedItem) return;

      const storedData: Store = (window as any).store.createStore({
        name: 'MODAL-STORE-' + storageKey,
      });

      storedData.set(storageKey, selectedItem);
      callback(selectedItem);
      modal.hide();
    },
    InvertedsubmitCondition: selectedItem === null,
    cancelable,
  });

  useEffect(() => {
    if (!storageKey) return;

    // check if storage key has any data
    const storedData: Store = (window as any).store.createStore({
      name: 'MODAL-STORE-' + storageKey,
    });

    const storedKey = storedData.get(storageKey) as ISelectElement;
    if (!storedKey) return setSelectedItem(null);

    const isValid = items.find(item => item.id === storedKey.id);
    if (!isValid) return setSelectedItem(null);

    modal.hide();
    setSelectedItem(storedKey);
    callback(storedKey);
  }, [!!items.length]);

  return modal;
}
