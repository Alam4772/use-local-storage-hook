````markdown
# @bytealam/use-local-storage

A powerful React hook to manage **localStorage** with extra features like TTL, cross-tab sync, namespaces, custom serialization, and fallback support.  
Works just like `useState`, but with persistence and advanced capabilities.

---

## **Installation**

```bash
npm install @bytealam/use-local-storage
````

or with yarn:

```bash
yarn add @bytealam/use-local-storage
```

---

## **Basic Usage**

```tsx
import React from 'react';
import useLocalStorage from '@bytealam/use-local-storage';

function App() {
  const [name, setName] = useLocalStorage('name', 'John Doe');

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>Hello, {name}!</p>
    </div>
  );
}

export default App;
```

---

## **Advanced Features**

### 1. TTL (Time-to-Live) Expiry

Automatically expire stored items after a specific time:

```tsx
const [session, setSession] = useLocalStorage('session', {}, {
  ttl: 1000 * 60 * 30 // 30 minutes
});
```

* Item is removed automatically after TTL expires.

---

### 2. Sync Across Browser Tabs

Keeps localStorage in sync across multiple tabs/windows:

```tsx
const [cart, setCart] = useLocalStorage('cart', [], { syncTabs: true });
```

* Updates in one tab propagate to others immediately.

---

### 3. Custom Serializer / Deserializer

Store complex objects or use custom formats:

```tsx
const [data, setData] = useLocalStorage('data', {}, {
  serialize: JSON.stringify,
  deserialize: JSON.parse
});
```

* Useful for objects, arrays, or custom transformations.

---

### 4. Namespace Support

Avoid key collisions by scoping items:

```tsx
const [userSettings, setUserSettings] = useLocalStorage('settings', {}, {
  namespace: 'myApp'
});
```

* Stored as `myApp:settings` in localStorage.

---

### 5. Fallback When localStorage is Unavailable

Works in environments where `localStorage` is disabled:

```tsx
const [value, setValue] = useLocalStorage('key', 'default', {
  fallback: true
});
```

* Falls back to in-memory storage.

---

## **API**

```ts
useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    ttl?: number;
    syncTabs?: boolean;
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    namespace?: string;
    fallback?: boolean;
  }
): [T, (val: T | ((prev: T) => T)) => void];
```

**Returns**: `[value, setValue]` — similar to `useState`.

---

## **Example With All Options**

```tsx
const [user, setUser] = useLocalStorage('user', { name: '', age: 0 }, {
  ttl: 3600000,        // 1 hour
  syncTabs: true,
  namespace: 'myApp',
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  fallback: true
});

setUser(prev => ({ ...prev, age: prev.age + 1 }));
```

---

## **License**

MIT © Alam Inamdar