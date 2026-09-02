One-line: the circular down-arrow on the seam between the hero and the forest section.

```jsx
<div style={{ display:"flex", justifyContent:"center", marginTop:-24 }}>
  <ScrollCue onClick={() => document.getElementById("services").scrollIntoView({ behavior:"smooth" })} />
</div>
```

One per page, at most. Never use it as a primary action.
