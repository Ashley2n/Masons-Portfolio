import { generateRandomId } from "./helper-func";

type NavLinkType = {
    name: string,
    link: string
}

export const navLinks: NavLinkType[] = [
    {
        name: "about",
        link: "/about"
    },
    {
        name: "media",
        link: "/meida"
    },
    {
        name: "resume",
        link: "/"
    }
]

export type StatsType = {
    metric: string
    desc: string,
}

export const statsData : StatsType[] = [
    {
        metric: "10",
        desc: "theatrical shows"
    },
    {
        metric: "12",
        desc: "concerts, competitions, and live events"
    },
    {
        metric: "4",
        desc: "theatrical/musical show"
    }
]

export type ExpertiseCardType = {
    title: string;
    desc: string;
    link: string;
    color: string
}

export const ExpertiseData: ExpertiseCardType [] = [
    {
        title: "Model",
        desc: "Stage & Screen Work",
        link: "/",
        color: "bg-brand-400"
    },
    {
        title: "Designer",
        desc: "Branding & Digital Design",
        link: "/",
        color:"bg-brand-600"
    },
    {
        title: "Singer",
        desc: "Live Vocals & Studio",
        link: "/",
        color: "bg-brand-500"
    },
    {
        title: "Actor",
        desc: "Theate & On Camera",
        link: "/", 
        color: "bg-brand-700"
    },
    
]

export const VideoCardData:VideoCardType[] = [
    {
        name: "My first Video",
        date: "01/12/2024",
        link: "/"
    },
    {
        name: "My first Video",
        date: "01/14/2024",
        link: "/"
    },
    {
        name: "My first Video",
        date: "01/16/2024",
        link: "/"
    },   
]

export type VideoCardType = {
    link: string | undefined;
    name: string;
    date: string;
}

export type ModelImageType = {
    id: string;
    alt: string;
    imageLink: string;
}

export const ModelShotsData:ModelImageType[] = [
    {
        id: generateRandomId(),
        imageLink: "/background/arindam-mondal-j1C4ZVwQ5UQ-unsplash.jpg",
        alt: "Something"
    },
    {
        id: generateRandomId(),
        imageLink: "/background/joseph-malone-DtJ7BJyez9E-unsplash.jpg",
        alt: "Something 2"
    },
    {
        id: generateRandomId(),
        imageLink: "/background/mike-hindle-fw93NEMCq6c-unsplash.jpg",
        alt: "Something 3"
    },
    {
        id: generateRandomId(),
        imageLink: "/background/thorium-o_IcRyN_Bo0-unsplash.jpg",
        alt: "Something 4"
    },
    {
        id: generateRandomId(),
        imageLink: "/background/joseph-malone-DtJ7BJyez9E-unsplash.jpg",
        alt: "Something 5"
    },
]