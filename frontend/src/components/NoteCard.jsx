import React from 'react';
import { FiEdit, FiTrash2, FiClock, FiList } from 'react-icons/fi';

// Accent colors cycling per card index
const accentColors = [
  'border-l-orange-400',
  'border-l-blue-400',
  'border-l-green-400',
  'border-l-purple-400',
  'border-l-pink-400',
  'border-l-teal-400',
];

const getAccentColor = (index) => accentColors[index % accentColors.length];

const getTimeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const created = new Date(date);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`;
  if (diffDays < 30) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
  return created.toLocaleDateString();
};

const getDescriptionPreview = (desc) => {
  if (!desc) return '';
  const lines = desc.split('\n').filter((line) => line.trim());
  if (lines.length > 1) return `${lines.length} items`;
  const words = desc.split(' ').length;
  if (words > 20) return `${Math.ceil(words / 200)} min read`;
  return '';
};

const NoteCard = ({ note, index = 0, onEdit, onDelete }) => {
  const accentColor = getAccentColor(index);
  const timeAgo = getTimeAgo(note.createdAt);
  const metadata = getDescriptionPreview(note.description);

  return (
    <div
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 border-l-4 ${accentColor} overflow-hidden group`}
    >
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {note.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4">
          {note.description}
        </p>

        {/* Metadata footer */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            {timeAgo && (
              <span className="flex items-center gap-1">
                <FiClock size={12} />
                {timeAgo}
              </span>
            )}
            {metadata && (
              <span className="flex items-center gap-1">
                <FiList size={12} />
                {metadata}
              </span>
            )}
          </div>

          {/* Action buttons — visible on hover */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Edit note"
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={() => onDelete(note._id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete note"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
