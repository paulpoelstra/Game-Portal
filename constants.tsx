
import React from 'react';
import { Game, Edition, Project, ProjectStatus, RoundCard, Task, TextFitRules } from './types';

export const CATEGORIES = [
  'Geography',
  'Entertainment',
  'History',
  'Arts & Culture',
  'Science & Tech',
  'Sports & Hobbies'
];

export const CATEGORY_STYLES: Record<string, { color: string, icon: string }> = {
  'Geography': { color: '#00AEEF', icon: 'globe' },
  'Geografie': { color: '#00AEEF', icon: 'globe' },
  'Entertainment': { color: '#E91E63', icon: 'tv' },
  'Amusement': { color: '#E91E63', icon: 'tv' },
  'History': { color: '#FFC107', icon: 'history' },
  'Arts & Culture': { color: '#9C27B0', icon: 'palette' },
  'Science & Tech': { color: '#4CAF50', icon: 'beaker' },
  'Sports & Hobbies': { color: '#FF9800', icon: 'trophy' }
};

export const RULES_TEXT_FRONT = `Maak minimaal 2 teams van 2 of meer spelers. Geef ieder team voldoende vellen papier en een pen. De teams schrijven steeds de door hen verzonnen teamnaam en het rondenummer bovenaan een vel. De oudste deelnemer (de quizmaster van de eerste ronde) pakt de 6 kaarten van 1 van de 9 quizzen en legt deze bovenop de andere kaarten in de verpakking. Nu pakt hij/zij de bovenste van deze 6 kaarten, controleert het rondenummer (ronde 1) en leest de categorie en de vragen stuk voor stuk voor (voor 'zet op volgorde-ronde' en 'rijtje-ronde'; zie verderop). Na iedere vraag krijgen de teams zo'n 30 seconden de tijd om het antwoord te noteren (met daarvoor het vraagnummer) of een aantekening te maken. Na de 5e vraag krijgen de teams nog zo'n 60 seconden voordat de quizmaster aangeeft dat de teams hun antwoordvel moeten doorgeven aan het team links van hen.`;

export const RULES_TEXT_BACK = `Nu leest de quizmaster rustig stuk voor stuk de antwoorden voor van de achterkant van de kaart en noteren de teams het aantal goede antwoorden rechtsboven op het vel. Nu ontvangen de teams hun eigen antwoordvel terug. Een speler van het team links van de quizmaster wordt de quizmaster van de volgende ronde etc. Bij een 'zet op volgorde-ronde' leest de quizmaster alles voor, schrijven de teams de 5 opties op en geven de juiste volgorde aan door er de getallen 1 t/m 5 achter te zetten (het getal '1' achter de 1e van de volgorde etc.) binnen zo'n 120 seconden. Bij een 'rijtje-ronde' noteren de teams 5 goede antwoorden binnen zo'n 120 seconden. Het team met de meeste punten na 6 rondes wint! Bij een gelijke stand wint het team dat de schattingsvraag het best heeft beantwoord. TIP: uiteraard kunnen ook 10 vragen per categorie gespeeld worden door de kaarten van 2 quizzen te gebruiken. TIP: indien gewenst kan besloten worden dat ieder team vooraf aan 1 van de 6 rondes hun enige 'verdubbelaar' kan inzetten (na de categorie te hebben gehoord) om hun score van die ronde te verdubbelen.`;

export const ICONS = {
  Dashboard: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Games: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2H3a2 2 0 01-2-2V4a2 2 0 114 0v1a2 2 0 012 2h4a2 2 0 012-2V4z" /><path d="M9 22V12h6v10" /><path d="M22 22V12h-6v10" /></svg>,
  Editions: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Projects: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Review: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  Production: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Exports: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Settings: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  ChevronDown: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Search: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Bell: (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
};

export const MOCK_GAMES: Game[] = [
  {
    id: 'game-1',
    name: 'Pubquiz Ultimate',
    description: 'De ultieme pubquiz-ervaring voor teams, met 6 diverse categorieën verspreid over meerdere rondes.',
    gridQuizzes: 9,
    gridRounds: 6,
    categories: CATEGORIES,
    allowedRoundTypes: ['Normal 5Q', 'Ordering', 'List', 'Rules'],
    textFitPresetId: 'rules-nl'
  }
];

export const MOCK_EDITIONS: Edition[] = [
  {
    id: 'ed-1',
    gameId: 'game-1',
    name: 'Ultimate NL 2025',
    language: 'Dutch',
    region: 'Netherlands, Belgium',
    year: 2025,
    sku: 'PQ-ULT-NL-25',
    format: 'Box Set',
    theme: 'Standard',
    description: 'Nederlandstalige versie van de Pubquiz.',
    textFitRulesId: 'rules-nl'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'NL 2025 Productie Run',
    editionId: 'ed-1',
    status: ProjectStatus.SET_BUILDING,
    progress: 45,
    totalQuestions: 270,
    deadline: '2025-06-15',
    owner: 'Paul',
    lastModified: '2025-02-10',
    grid: Array(9).fill(null).map((_, q) => Array(6).fill(null).map((_, r) => ({
      id: `q${q}-r${r}`,
      type: 'Normal 5Q',
      questions: [],
      reviewStatus: 'Pending',
      fitStatus: 'Ok'
    })))
  }
];

export const MOCK_TASKS: Task[] = [
  { id: 't-1', label: 'Verifieer Geografie Ronde 4', priority: 'High', project: 'NL 2025' },
  { id: 't-2', label: 'Vertaal Spelregels', priority: 'Medium', project: 'Trivia UK 2024' },
  { id: 't-3', label: 'Check Tekst Fit: Sport', priority: 'Low', project: 'NL 2025' }
];

export const TEXT_FIT_PRESETS: TextFitRules[] = [
  {
    id: 'rules-nl',
    name: 'Standard Card NL',
    normal: { warnChars: 120, maxChars: 160, warnLines: 3, maxLines: 4 },
    ordering: { promptWarn: 180, promptMax: 220, itemWarn: 25, itemMax: 32 },
    list: { promptWarn: 200, promptMax: 260, hintWarn: 60, hintMax: 90 }
  }
];

export const EUROPEAN_LANGUAGES = [
  'Dutch', 'English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese', 'Polish', 'Swedish', 'Danish', 'Finnish', 'Norwegian'
];

export const EUROPEAN_REGIONS = [
  'Netherlands', 'Belgium', 'United Kingdom', 'Ireland', 'France', 'Germany', 'Austria', 'Switzerland', 'Spain', 'Italy', 'Portugal', 'Poland', 'Sweden', 'Denmark', 'Finland', 'Norway'
];
