import { SafeUrl } from "@angular/platform-browser";

export interface Song {
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    audioFile: string,
    duration: number,
    totalTime: string,
    createdOn: Date,
    trustedAudioFile: SafeUrl,
    userName: string,
    index: number,
}