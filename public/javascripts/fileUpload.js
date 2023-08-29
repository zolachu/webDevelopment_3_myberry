// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import FileImageResize from 'file-image-resize';
// import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
// import * as FilePond from 'filepond';

FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
  stylePanelAspectRatio: 150 / 100,
});
FilePond.parse(document.body);
