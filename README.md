# litteraturlabbet-frontend

## Development
The tools were developed by Gothenburg's Research Infrastructure in Digital Humanities (GRIDH) in collaboration with the Literature Bank. Jonathan Westin and Siska Humlesjö have been project managers. Primary developers have been Victor Wåhlstrand Skärström, Aram Karimi, David Alfter, Ashely Green, Jonathan Westin, Kristin Åkerlund and Tristan Bridge. The Text Recycling tool uses Passim, developed by David Smith, to detect similar phrases.

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

The images shown in the gallery were extracted using a pre-trained YOLOv8s object detection model finetuned on a subset of the Litteraturbanken data using manually labelled images and manually verified detections from a fine-tuned FasterRCNN model used previously.  The detected images were exported as crops during model prediction.  The class labels are manually corrected where necessary.

Crops were tagged using the Recognize Anything Model from [Zhang et al. 2023] (https://arxiv.org/pdf/2306.03514).  The tags were returned in English and filtered to those most related to the works in the dataset, then translated to Swedish and assigned to a category.

Click on an image in the gallery to see the available metadata about the image and work it belongs to.  Below the metadata there is also a gallery of similar images.  These similar images were calculated by extracting the image embeddings from a resnext50-32x4d-imagenet-torch model in FiftyOne for input in Spotify's annoy library to calculate the approximate nearest neighbours with euclidean metric.  Recurring images, those used throughout a work, were excluded using the work id and a match distance threshold.

