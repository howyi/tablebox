import Image from "@tiptap/extension-image";

const UpdatedImage = Image.extend({
  name: 'updated_image',
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },
});

export default UpdatedImage;
