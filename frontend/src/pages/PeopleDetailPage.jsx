import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getPersonFull, getPersonAnime, getPersonVoices, getPersonPictures } from '../services/api';
import { SkeletonDetail } from '../components/shared/SkeletonCard';

const PeopleDetailPage = () => {
  const { id } = useParams();

  const { data: personData, isLoading, error } = useQuery({
    queryKey: ['personFull', id], queryFn: () => getPersonFull(id), staleTime: 10 * 60 * 1000,
  });
  const { data: animeData } = useQuery({
    queryKey: ['personAnime', id], queryFn: () => getPersonAnime(id), staleTime: 10 * 60 * 1000,
  });
  const { data: voicesData } = useQuery({
    queryKey: ['personVoices', id], queryFn: () => getPersonVoices(id), staleTime: 10 * 60 * 1000,
  });
  const { data: picsData } = useQuery({
    queryKey: ['personPics', id], queryFn: () => getPersonPictures(id), staleTime: 10 * 60 * 1000,
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [id]);

  if (isLoading) return <div className="py-8"><SkeletonDetail /></div>;

  if (error || !personData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in">
        <div className="text-8xl mb-6">😔</div>
        <h3 className="text-3xl font-black text-white mb-4">Failed to Load Person</h3>
        <Link to="/people" className="px-8 py-3 bg-gradient-to-r from-[theme(--color-primary)] to-[theme(--color-accent)] text-white font-black rounded-xl transition-all">← Back to People</Link>
      </div>
    );
  }

  const person = personData.data;
  const animeCredits = animeData?.data?.slice(0, 12) || [];
  const voiceRoles = voicesData?.data?.slice(0, 12) || [];
  const pictures = picsData?.data || [];
  const mainImage = person.images?.jpg?.image_url;

  return (
    <>
      <Helmet>
        <title>{person.name} — Kyynime</title>
        <meta name="description" content={person.about?.substring(0, 160) || `Profile for ${person.name}`} />
        <meta property="og:title" content={`${person.name} — Kyynime`} />
        <meta property="og:image" content={mainImage} />
      </Helmet>

      <div className="animate-fade-in">
        <Link to="/people" className="inline-flex items-center gap-2 text-[theme(--color-text-muted)] hover:text-white transition-colors mb-6 font-medium">← Back to People</Link>

        <div className="bg-[theme(--color-dark-card)] rounded-2xl shadow-2xl overflow-hidden border border-[theme(--color-border)]">
          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[theme(--color-dark-light)] to-[theme(--color-dark-card)]">
            <div className="flex flex-col lg:flex-row gap-6">
              <img src={mainImage} alt={person.name} className="w-40 h-56 sm:w-48 sm:h-64 object-cover rounded-xl shadow-2xl border-4 border-[theme(--color-primary)]/50 mx-auto lg:mx-0" />
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">{person.name}</h1>
                {person.given_name && <p className="text-[theme(--color-text-muted)] text-base mb-3">{person.given_name} {person.family_name || ''}</p>}
                <div className="flex flex-wrap gap-2 mb-4">
                  {person.favorites && <span className="bg-gradient-to-r from-pink-500 to-rose-600 border-2 border-pink-400 px-4 py-1.5 rounded-xl text-white font-black text-sm">❤️ {person.favorites.toLocaleString()} Favorites</span>}
                  {person.birthday && <span className="bg-[theme(--color-dark)]/50 border border-[theme(--color-border)] px-4 py-1.5 rounded-xl text-white text-sm font-medium">🎂 {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
                </div>
                {person.about && (
                  <div className="bg-[theme(--color-dark)]/50 border border-[theme(--color-border)] rounded-xl p-4 max-h-48 overflow-y-auto">
                    <p className="text-[theme(--color-text-secondary)] text-sm leading-relaxed whitespace-pre-line">{person.about}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voice Roles */}
          {voiceRoles.length > 0 && (
            <div className="p-4 sm:p-6 lg:p-8 border-t border-[theme(--color-border)]">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">🎙️ Voice Acting Roles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {voiceRoles.map((role, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[theme(--color-dark-light)] border border-[theme(--color-border)] rounded-xl p-3 hover:border-[theme(--color-primary)] transition-all">
                    <Link to={`/characters/${role.character.mal_id}`}>
                      <img src={role.character.images?.jpg?.image_url} alt={role.character.name} className="w-12 h-12 rounded-lg object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/characters/${role.character.mal_id}`} className="text-white text-sm font-bold truncate hover:text-[theme(--color-primary)] transition-colors block">{role.character.name}</Link>
                      <p className="text-[theme(--color-primary)] text-xs font-semibold">{role.role}</p>
                      {role.anime && <Link to={`/anime/${role.anime.mal_id}`} className="text-[theme(--color-text-muted)] text-xs truncate block hover:text-white transition-colors">{role.anime.title}</Link>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anime Credits */}
          {animeCredits.length > 0 && (
            <div className="p-4 sm:p-6 lg:p-8 border-t border-[theme(--color-border)]">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">🎬 Anime Staff Positions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {animeCredits.map((credit, i) => (
                  <Link key={i} to={`/anime/${credit.anime.mal_id}`} className="bg-[theme(--color-dark-light)] border border-[theme(--color-border)] rounded-xl overflow-hidden hover:scale-105 hover:border-[theme(--color-primary)] transition-all">
                    <img src={credit.anime.images.jpg.image_url} alt={credit.anime.title} className="w-full h-36 sm:h-44 object-cover" />
                    <div className="p-2">
                      <h4 className="text-white text-xs font-bold line-clamp-2">{credit.anime.title}</h4>
                      <p className="text-[theme(--color-primary)] text-[10px] mt-1 font-semibold">{credit.position}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {pictures.length > 0 && (
            <div className="p-4 sm:p-6 lg:p-8 border-t border-[theme(--color-border)]">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">🖼️ Gallery</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {pictures.slice(0, 12).map((pic, i) => (
                  <img key={i} src={pic.jpg?.image_url} alt={`${person.name} ${i + 1}`} className="w-full aspect-[2/3] object-cover rounded-xl border border-[theme(--color-border)] hover:border-[theme(--color-primary)] hover:scale-105 transition-all" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PeopleDetailPage;
