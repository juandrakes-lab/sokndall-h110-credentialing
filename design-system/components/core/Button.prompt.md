One-line: the only button in the system — `primary` for the page's main action, `gold` for the single highest-emphasis CTA, `outline` for the quieter action beside it.

```jsx
<Button variant="gold" arrow>Schedule a Call</Button>
<Button arrow>Get Free Consultation</Button>
<Button variant="outline" iconLeft={<i data-lucide="play" />}>Watch Overview</Button>
<Button variant="onDark" arrow>Explore All Services</Button>
```

Hover darkens the fill one step; press darkens again and scales to 0.985. Never pill-shaped, never uppercase, never gradient-filled. Use `gold` at most once per view.
