export interface UserData {
    name: string;
    job: string;
    location: string;
    mail: string;
    phone: string;
    github: string;
    company?: string;
    aboutme: string;
    skills: Skills;
    experiences: Experience[];
}

export interface Skills {
    technical: string[];
    soft: string[];
}

export interface Experience {
    company: string;
    dates: DateRange[];
    description?: string;
    projects: Project[];
}

export interface DateRange {
    role: string;
    start: string;
    end: string;
}

export interface Project {
    name: string;
    description?: string;
    tech: string[];
}
