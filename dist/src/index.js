"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tracks_json_1 = require("../resources/tracks.json");
const app = (0, express_1.default)();
const PORT = 3000;
// Use CORS module to allow access (should be set to domain/regex if used properly)
app.use((0, cors_1.default)({ origin: true }));
app.route('/get-track-from-id/:id').get((request, response) => {
    try {
        // Attempt to find song's index using provided ID and return title in JSON form
        const track = tracks_json_1.tracks[Number(request.params.id) - 1].title;
        response.json({ data: { track }, err: {} });
    }
    catch (err) {
        response.status(404).json({
            data: {},
            err: { code: 404, message: 'Song not found in the database.' },
        });
    }
});
app.route('/get-tracks-from-artist/:name').get((request, response) => {
    try {
        // Finds only items with matching artist, changes object's shape as artist field is redundant
        const artistTracks = tracks_json_1.tracks
            .filter((song) => song.artist === request.params.name)
            .map((song) => {
            return { title: song.title, id: song.id };
        });
        // If there's no songs found - needed as error not thrown if empty
        if (artistTracks.length === 0)
            throw new Error();
        response.json({ data: { artistTracks }, err: {} });
    }
    catch (err) {
        response.status(404).json({
            data: {},
            err: { code: 404, message: 'Artist not found in the database.' },
        });
        return;
    }
});
app.listen(PORT);
//# sourceMappingURL=index.js.map