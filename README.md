# litteraturlabbet-frontend

## Development
The tools were developed by Gothenburg's Research Infrastructure for Digital Humanities (GRIDH) in collaboration with the Literature Bank. Jonathan Westin and Siska Humlesjö have been project managers. Primary developers have been Victor Wåhlstrand Skärström, Aram Karimi, David Alfter, Ashely Green, Jonathan Westin, Kristin Åkerlund and Tristan Bridge. The Text Recycling tool uses Passim, developed by David Smith, to detect similar phrases.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
## Images in the gallery

The images shown in the gallery were extracted using a pre-trained Faster R-CNN model with ResNet50 backbone finetuned on a manually labelled subset of the Litterturbanken dataset.  The detected images were cropped with a border and exported.  The class labels are manually corrected where necessary.  

Click on an image in the gallery to see the available metadata about the image and work it belongs to.  Below the metadata there is also a gallery of similar images.  These similar images were calculated by extracting the image embeddings from a ResNet50 model in Fastai with the TensorBoardCallback for input in Spotify's annoy library to calculate the approximate nearest neighbours with angular distance.  Recurring images, those used throughout a work, were excluded using the work id and a match distance threshold.

