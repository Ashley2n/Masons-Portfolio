import { Inter, Playfair_Display, Space_Mono } from "next/font/google";
import { title } from "process";

export const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter'
})

export const playfair_display = Playfair_Display({
    subsets: ["latin"],
    variable: '--font-playfair'
})

export const space_mono = Space_Mono({
    subsets: ["latin"],
    weight: ['400', '700'],
    style: ['italic', 'normal'],
    variable: "--font-space"
})

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