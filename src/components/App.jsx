import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { nanoid } from 'nanoid';
import {
  searchImagesByQuery,
  parametersRequest,
  fetchImagesByCategory,
} from './services/api';
import { GlobalStyle } from './GlobalStyle';
import { Layout } from './Layout';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadMoreButton } from './LoadMoreButton/LoadMoreButton';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { EndGalleryNotification } from './App.styled';
import {
  toastContainerStyle,
  toastOptions,
  toastWarningOptions,
} from './helpers/helpers';
import { Categories } from './Categories/Categories';
import { Error } from './Error/Error';
import { ToTopButton } from './ToTopBtn/ToTopBtn';

export const App = () => {
  const [query, setQuery] = useState('');
  const [randomID, setRandomID] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [openImage, setOpenImage] = useState({ src: null, alt: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);

      try {
        const data = await fetchImagesByCategory();

        setCategories(data);
      } catch (err) {
        toast.remove();
        toast.error('Oops, something went wrong. Try reloading the page.');

        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchImages() {
      if (!query) {
        return;
      }

      setIsLoading(true);

      try {
        const data = await searchImagesByQuery(query, page);

        if (!data.hits.length) {
          toast.remove();
          toast.error(
            'Sorry, there are no images matching your search query. Please try again.'
          );

          setQuery('');

          return;
        }

        setImages(prevState => [...prevState, ...data.hits]);
        setIsLastPage(
          page >= Math.ceil(data.totalHits / parametersRequest.perPage)
        );

        if (page === 1) {
          toast.remove();
          toast.success(`Hooray! We found ${data.totalHits} images.`);
        }
      } catch (err) {
        toast.remove();
        toast.error('Oops, something went wrong. Try reloading the page.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [query, page, randomID]);

  const onSearch = query => {
    if (!query.length) {
      toast.remove();
      toast('Input field is empty. Enter search query!', toastWarningOptions);

      return;
    }

    setQuery(query);
    setRandomID(nanoid());
    setImages([]);
    setPage(1);
    setIsLastPage(false);
  };

  const onSelectCategory = category => {
    setQuery(category);
    setRandomID(nanoid());
    setImages([]);
    setPage(1);
  };

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const onOpenModal = (src, alt) => {
    setIsOpenModal(true);
    setOpenImage({ src, alt });

    document.body.style.overflow = 'hidden';
  };

  const onCloseModal = () => {
    setIsOpenModal(false);

    document.body.style.overflow = '';
  };

  const onHomeBtn = () => {
    setQuery('');
    setRandomID('');
    setImages([]);
    setPage(1);
    setIsLastPage(false);
    setOpenImage({ src: null, alt: null });
    setIsError(false);
  };

  const btnRef = useRef();

  useLayoutEffect(() => {
    if (page > 1) {
      const { height } = btnRef.current.getBoundingClientRect();

      window.scrollBy({ top: height + 24, behavior: 'smooth' });
    }
  });

  return (
    <Layout>
      {!isOpenModal && <Searchbar onSearch={onSearch} onHomeBtn={onHomeBtn} />}

      {!query && !isError && !isLoading && (
        <Categories
          categories={categories}
          onSelectCategory={onSelectCategory}
        />
      )}

      {images.length > 0 && (
        <ImageGallery
          images={images}
          onOpenModal={onOpenModal}
          btnRef={btnRef}
        />
      )}

      {isLastPage && (
        <EndGalleryNotification>
          We're sorry, but you've reached the end of search results.
        </EndGalleryNotification>
      )}

      {images.length > 0 && !isLastPage && !isLoading && (
        <LoadMoreButton onLoadMore={onLoadMore} textButton="Load more" />
      )}

      {isLoading && <Loader text="Loading data, please wait..." />}

      <Modal
        isOpen={isOpenModal}
        closeModal={onCloseModal}
        openImage={openImage}
      />

      {query && <ToTopButton />}

      {isError && <Error />}

      <Toaster
        position="top-right"
        containerStyle={toastContainerStyle}
        toastOptions={toastOptions}
      />

      <GlobalStyle />
    </Layout>
  );
};
