"use client";

import { motion } from "framer-motion";
import ImageUploader from "../ProductFormComponents/ImageUploader";
import TagInput from "../ProductFormComponents/TagInput";

export default function StepMedia({ 
  formData, 
  handleImageUpload, 
  removeImage, 
  setPrimaryImage,
  addTag,
  removeTag,
  tagInput,
  setTagInput,
  updateFormData,
  updateNestedField = null,
}) {
  const images = formData?.images || [];
  const tags = formData?.tags || [];

  const onUpload = (newImages) => {
    if (typeof handleImageUpload === "function") return handleImageUpload(newImages);
    const added = Array.isArray(newImages) ? [...images, ...newImages] : [...images, newImages];
    if (updateNestedField) {
      updateNestedField('images', null, added);
    } else if (typeof updateFormData === 'function') {
      updateFormData({ images: added });
    }
  };

  const onRemove = (key) => {
    if (typeof removeImage === "function") return removeImage(key);
    let updated;
    if (typeof key === 'number') updated = images.filter((_, i) => i !== key);
    else updated = images.filter((it) => (it && (it.url || it.src || it.path) ? (it.url || it.src || it.path) !== key : it !== key));
    if (updateNestedField) updateNestedField('images', null, updated);
    else if (typeof updateFormData === 'function') updateFormData({ images: updated });
  };

  const onSetPrimary = (key) => {
    if (typeof setPrimaryImage === "function") return setPrimaryImage(key);
    const idx = typeof key === 'number' ? key : images.findIndex((it) => (it && (it.url || it.src || it.path) ? (it.url || it.src || it.path) === key : it === key));
    if (idx < 0) return;
    const imgs = [...images];
    if (imgs[0] && typeof imgs[0] === 'object') {
      const updated = imgs.map((it, i) => ({ ...it, isPrimary: i === idx }));
      if (updateNestedField) updateNestedField('images', null, updated);
      else if (typeof updateFormData === 'function') updateFormData({ images: updated });
      return;
    }
    const [item] = imgs.splice(idx, 1);
    imgs.unshift(item);
    if (updateNestedField) updateNestedField('images', null, imgs);
    else if (typeof updateFormData === 'function') updateFormData({ images: imgs });
  };

  const onAddTag = (t) => {
    if (typeof addTag === 'function') return addTag(t);
    const updated = [...tags, t];
    if (typeof updateFormData === 'function') updateFormData({ tags: updated });
  };

  const onRemoveTag = (t) => {
    if (typeof removeTag === 'function') return removeTag(t);
    const updated = tags.filter((x) => x !== t);
    if (typeof updateFormData === 'function') updateFormData({ tags: updated });
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <ImageUploader
        images={images}
        onUpload={onUpload}
        onRemove={onRemove}
        onSetPrimary={onSetPrimary}
      />

      <TagInput
        tags={tags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />
    </motion.div>
  );
}