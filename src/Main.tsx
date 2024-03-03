import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import Photo from "./Photo";

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

interface PhotoData {
  urls: {
    regular: string;
  };
  alt_description: string;
  likes: number;
  user: {
    name: string;
    portfolio_url: string;
    profile_image: {
      medium: string;
    };
  };
}

const Main: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const mounted = useRef(false);
  const [newImages, setNewImages] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      setPhotos((prevData) => {
        if (query && page === 1) {
          return data.results || [];
        } else if (query) {
          return [...prevData, ...(data.results || [])];
        } else {
          return [...prevData, ...(data || [])];
        }
      });

      setNewImages(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setNewImages(false);
      setLoading(false);
    }
  };

  // Fetch images on entering the website and when scrolling
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;
    setPage((oldPage) => oldPage + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newImages]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 3) {
      setNewImages(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchImages();
    }
    setPage(1);
  };

  return (
    <main>
      <section className="search">
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />
          <button type="submit" className="submit-btn"></button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) => (
            <Photo key={index} {...photo} />
          ))}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
};

export default Main;
