One-line: the fixed site header.

```jsx
<NavBar items={["Services","About Us","Blog","Pages","Contact"]} active="Services"
  transparent={!scrolled} onSelect={setPage} />
```

Desktop-only, 1120px minimum — it degrades by scrolling horizontally, not wrapping. The phone block replaces a nav CTA button; do not add one.
