# Migrating from v11 to v12

Polaris v12.0.0 ([full release notes](https://github.com/Shopify/polaris/releases/tag/v12.0.0)) prop replacement, removal of components, renamed components, and token changes.

## Table of Contents

- [Quick migration guide](#quick-migration-guide)

## Quick migration guide

**Layout.Section**

- One third:

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Layout.Section" --from="oneThird" --to="variant" --newValue="oneThird"`

- One half:

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Layout.Section" --from="oneHalf" --to="variant" --newValue="oneHalf"`

- Full width:

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Layout.Section" --from="fullWidth" --to="variant" --newValue="fullWidth"`

- Secondary, becomes oneThird:

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Layout.Section" --from="secondary" --to="variant" --newValue="oneThird"`

**TextField**

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="TextField" --from="borderless" --to="variant" --newValue="borderless"`

**Box**

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Box" --from="borderRadiusEndStart" --to="borderEndStartRadius"`

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Box" --from="borderRadiusEndEnd" --to="borderEndEndRadius"`

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Box" --from="borderRadiusStartStart" --to="borderStartStartRadius"`

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Box" --from="borderRadiusStartEnd" --to="borderStartEndRadius"`

**HorizontalStack**

`npx @shopify/polaris-migrator react-rename-component <path> --renameFrom="HorizontalStack" --renameTo="InlineStack" --renamePropsFrom="HorizontalStackProps" --renamePropsTo="InlineStackProps"`

**VerticalStack**

`npx @shopify/polaris-migrator react-rename-component <path> --renameFrom="VerticalStack" --renameTo="BlockStack" --renamePropsFrom="VerticalStackProps" --renamePropsTo="BlockStackProps"`

**HorizontalGrid**

`npx @shopify/polaris-migrator react-rename-component <path> --renameFrom="HorizontalGrid" --renameTo="InlineGrid" --renamePropsFrom="HorizontalGridProps" --renamePropsTo="InlineGridProps"`

**Button**

- connectedDisclosure: [See the updated split example](https://polaris.shopify.com/components/actions/button)

// TODO - Boolean prop to tone, variant migration

**ButtonGroup**

- Spacing

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="ButtonGroup" --from="spacing" --to="gap"`

- Segmented

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="ButtonGroup" --from="segmented" --to="variant" --newValue="segmented"`

**Banner**

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Banner" --from="status" --to="tone"`

**Icon**

- Backdrop is not a pattern in the new Polaris design language. If you must use a backdrop on your icon, use Box.

```tsx
<Box background={boxBackground} padding="1" width="28px" borderRadius="full">
  <Icon source={CirclePlusMinor} color={iconColor} />
</Box>
```

- Color

`npx @shopify/polaris-migrator react-rename-component-prop <path> --componentName="Icon" --from="color" --to="tone"`