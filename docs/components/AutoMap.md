---
module: "@wq/map"
purpose: maps
---

# AutoMap

@wq/map's `<AutoMap/>` [component] reads the [map configuration][@wq/map] corresponding to the current route and renders a [`<Map/>`][Map] with the appropriate inputs and controls

The typical component hierarchy generated by `<AutoMap/>` is as follows: 

```jsx
<AutoMap>
  <Map>
    <MapInteraction />
    <Legend>
      <BasemapToggle>
        <AutoBasemap>
          <Tile />
        </AutoBasemap>
      </BasemapToggle>
      <OverlayToggle>
        <AutoOverlay>
          <Geojson />
        </AutoOverlay>
      </OverlayToggle>
    </Legend>
  </Map>
</AutoMap>
```

## Source

The source code for `<AutoMap/>` is available here:

 * [AutoMap.js (@wq/map)][map-src]

The [@wq/map] implementation leverages [`useComponents()`][useComponents] and [`useOverlayComponents()`][useOverlayComponents]  to facilitate customization, so there is no alternate [@wq/map-gl] or native version.

[component]: ./index.md
[Map]: ./Map.md
[@wq/map]: ../@wq/map.md
[@wq/map-gl]: ../@wq/map-gl.md
[useComponents]: ../hooks/useComponents.md
[useOverlayComponents]: ../hooks/useOverlayComponents.md

[map-src]: https://github.com/wq/wq.app/blob/main/packages/map/src/components/AutoMap.js
