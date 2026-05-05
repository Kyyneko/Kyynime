import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getCharacterFull, getCharacterAnime, getCharacterManga, getCharacterVoices, getCharacterPictures } from '../services/api';
import { SkeletonDetail } from '../components/shared/SkeletonCard';

const CharacterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: charData, isLoading, error } = useQuery({
    queryKey: ['charFull', id], queryFn: () => getCharacterFull(id), staleTime: 10 * 60 * 1000,
  });
  const { data: animeData } = useQuery({
    queryKey: ['charAnime', id], queryFn: () => getCharacterAnime(id), staleTime: 10 * 60 * 1000,
  });
  const { data: voicesData } = useQuery({
    queryKey: ['charVoices', id], queryFn: () => getCharacterVoices(id), staleTime: 10 * 60 * 1000,
  });
  const { data: picsData } = useQuery({
    queryKey: ['charPics', id], queryFn: () => getCharacterPictures(id), staleTime: 10 * 60 * 1000,
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [id]);

  if (isLoading) return <div className="py-8"><SkeletonDetail /></div>;

  if (error || !charData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
        <div className="text-8xl mb-6"></div>
        <h3 className="text-3xl font-black text-white mb-4">Failed to Load Character</h3>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-black rounded-xl transition-all">← Go Back</button>
      </div>
    );
  }

  const char = charData.data;
  const animeRoles = animeData?.data?.slice(0, 12) || [];
  const voices = voicesData?.data || [];
  const pictures = picsData?.data || [];
  const mainImage = char.images?.jpg?.image_url;

  return (
    <>
      <Helmet>
        <title>{char.name} — Kyynime</title>
        <meta name="description" content={char.about?.substring(0, 160) || `Character profile for ${char.name}`} />
        <meta property="og:title" content={`${char.name} — Kyynime`} />
        <meta property="og:image" content={mainImage} />
      </Helmet>

      <div className="animate-fade-in">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[theme(--color-text-muted)] hover:text-white transition-colors mb-6 font-medium cursor-pointer">← Back</button>

        <div className="bg-[theme(--color-dark-card)] rounded-2xl shadow-2xl overflow-hidden border border-[theme(--color-border)]">
          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[theme(--color-dark-light)] to-[theme(--color-dark-card)]">
            <div className="flex flex-col lg:flex-row gap-6">
              <img src={mainImage} alt={char.name} className="w-40 h-56 sm:w-48 sm:h-64 object-cover rounded-xl shadow-2xl border-4 border-[theme(--color-primary)]/50 mx-auto lg:mx-0" />
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">{char.name}</h1>
                {char.name_kanji && <p className="text-[theme(--color-text-muted)] text-lg mb-4">{char.name_kanji}</p>}
                <div className="flex flex-wrap gap-2 mb-4">
                  {char.favorites && (
                    <span className="bg-gradient-to-r from-pink-500 to-rose-600 border-2 border-pink-400 px-4 py-1.5 rounded-xl text-white font-black text-sm"> {char.favorites.toLocaleString()} Favorites</span>
                  )}
                </div>
                {char.about && (
                  <div className="bg-[theme(--color-dark)]/50 border border-[theme(--color-border)] rounded-xl p-4 max-h-48 overflow-y-auto">
                    <p className="text-[theme(--color-text-secondary)] text-sm leading-relaxed whitespace-pre-line">{char.about}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Anime Appearances */}
          {animeRoles.length > 0 && (
            <div className="p-4 sm:p-6 lg:p-8 border-t border-[theme(--color-border)]">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2"> Anime Appearances</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {animeRoles.map(role => (
                  <Link key={role.anime.mal_id} to={`/anime/${role.anime.mal_id}`} className="bg-[theme(--color-dark-light)] border border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] transition-all">
                    <img src={role.anime.images.jpg.image_url} alt={role.anime.title} className="w-full h-36 sm:h-44 object-cover" />
                    <div className="p-2">
                      <h4 className="text-white text-xs font-bold line-clamp-2">{role.anime.title}</h4>
                      <p className="text-[theme(--color-primary)] text-[10px] mt-1 font-semibold">{role.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Voice Actors */}
          {voices.length > 0 && (
            <div className="p-4 sm:p-6 lg:p-8 border-t border-[theme(--color-border)]">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2"> Voice Actors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {voices.slice(0, 9).map((va, i) => (
                  <Link key={i} to={`/people/${va.person.mal_id}`} className="flex items-center gap-3 bg-[theme(--color-dark-light)] border border-[theme(--color-border)] rounded-xl p-3 hover:border-[theme(--color-primary)] transition-all">
                    <img src={va.person.images?.jpg?.image_url} alt={va.person.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{va.person.name}</p>
                      <p className="text-[theme(--color-text-muted)] text-xs">{va.language}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {pictures.length > 0 && (
            <div className="p-4 sm:p-6 lg:p-8 border-t border-[theme(--color-border)]">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2"> Gallery</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {pictures.slice(0, 12).map((pic, i) => (
                  <img key={i} src={pic.jpg?.image_url} alt={`${char.name} ${i + 1}`} className="w-full aspect-[2/3] object-cover rounded-xl border border-[theme(--color-border)] hover:border-[theme(--color-primary)] hover:scale-105 transition-all" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CharacterDetailPage;
