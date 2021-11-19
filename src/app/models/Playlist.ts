import { Song } from "./Song";

export interface Playlist {
    id: number,
    title: string,
    imageUrl: string,
    releaseYear: string,
    songCount: number,
    creatorName: string,
    songs: Array<Song>
}