import express from 'express';
import cors from 'cors';

import { tracks } from '../resources/tracks.json';

const app = express();
const PORT = 3000;

interface TrackInfo {
  artist: string;
  title: string;
  id: number;
}

// Use CORS module to allow access (should be set to domain/regex if used properly)
app.use(cors({ origin: true }));

app.route('/get-track-from-id/:id').get((request, response) => {
  try {
    // Attempt to find song's index using provided ID and return title in JSON form
    const track = tracks[Number(request.params.id) - 1].title;
    response.json({ data: { track }, err: {} });
  } catch (err) {
    response.status(404).json({
      data: {},
      err: { code: 404, message: 'Song not found in the database.' },
    });
  }
});

app.route('/get-tracks-from-artist/:name').get((request, response) => {
  try {
    // Finds only items with matching artist, changes object's shape as artist field is redundant
    const artistTracks = tracks
      .filter((song: TrackInfo) => song.artist === request.params.name)
      .map((song: TrackInfo) => {
        return { title: song.title, id: song.id };
      });

    // If there's no songs found - needed as error not thrown if empty
    if (artistTracks.length === 0) throw new Error();

    response.json({ data: { artistTracks }, err: {} });
  } catch (err) {
    response.status(404).json({
      data: {},
      err: { code: 404, message: 'Artist not found in the database.' },
    });
    return;
  }
});

app.listen(PORT);
