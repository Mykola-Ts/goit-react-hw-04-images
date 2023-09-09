import PropTypes from 'prop-types';
import { Gallery, GalleryItem } from './ImageGallery.styled';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';

export const ImageGallery = ({ images, onOpenModal, btnRef }) => {
  return (
    <Gallery>
      {images.map(({ id, webformatURL, largeImageURL, tags }) => (
        <GalleryItem
          key={id}
          onClick={() => onOpenModal(largeImageURL, tags)}
          data-url={largeImageURL}
          ref={btnRef}
        >
          <ImageGalleryItem
            webformatURL={webformatURL}
            largeImageURL={largeImageURL}
            tags={tags}
          />
        </GalleryItem>
      ))}
    </Gallery>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  btnRef: PropTypes.object.isRequired,
};
