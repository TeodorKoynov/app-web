import { SafeUrl } from "@angular/platform-browser";

export interface Song {
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    audioFile: string,
    createdOn: Date,
    trustedAudioFile: SafeUrl,
    userName: string,
    lenght: number,
    index: number
}