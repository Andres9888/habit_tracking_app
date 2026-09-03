/**
 * Science drill-down copy — Health & Fitness.
 *
 * Citations here use the template's OWN curated `scientificReference` and
 * `scientificLink` from templatesDataSeed rather than a substitute chosen from
 * memory. Where that reference could not be read and summarised directly,
 * `evidence` is omitted so the Science-backed badge stays hidden.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const HEALTH_FITNESS_ENRICHMENT: Record<string, ScienceEnrichment> = {
  '7,000 Steps': {
    suggestedWhy: 'A daily walking floor tracks with living longer and steadier energy, so health improves without a gym or hard sessions.',
    tagline: 'A daily step floor — lower than the famous number.',
    lead: 'Walking volume tracks closely with long-term health, but the dose-response curve bends early: most of the benefit arrives well before the marketing-friendly ten thousand. What matters is having a floor you actually clear every day.',
    cadenceLabel: 'Daily · roughly 20 min of walking',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Lower long-term risk',
        description: 'Step volume tracks with living longer, and better.',
      },
      {
        icon: 'wave',
        title: 'Steadier energy',
        description: 'Regular movement beats occasional hard sessions.',
      },
      {
        icon: 'target',
        title: 'No gym needed',
        description: 'The most repeatable exercise there is.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Legs notice first',
        description: 'Mild soreness if you are starting from a low base.',
      },
      {
        when: 'Week 3',
        title: 'Walking becomes default',
        description: 'You start choosing the walk without deciding to.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Hitting the floor stops requiring attention.',
        peak: true,
      },
    ],
    howToStart: [
      'Find your current daily average first, then add 1,000.',
      'Bolt walking onto trips you already make — one stop early, park further out.',
      'A 20-minute walk is roughly 2,000 steps. Two of those does most of it.',
      'Clear the floor every day before chasing a bigger number.',
    ],
    sources: [
      {
        authors: 'Lancet Public Health',
        title: 'Step count dose-response meta-analysis',
        journal: 'The Lancet Public Health',
        year: '2025',
        link: 'https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(25)00164-1/fulltext',
      },
    ],
  },

  'Post-Meal Walk (10 Minutes)': {
    suggestedWhy: 'Walking after eating puts muscles to work clearing glucose, so the spike flattens and the afternoon crash never lands.',
    tagline: 'A short walk after eating to blunt the glucose spike.',
    lead: 'Walking after a meal puts your muscles to work clearing glucose from your blood while it is still arriving. That flattens the post-meal spike — and it is the spikes, more than the average, that drive the afternoon energy crash.',
    evidence:
      'DiPietro et al. (2016) report that a simple post-meal walk reduces postprandial glucose excursions in type 2 diabetes.',
    cadenceLabel: 'After your largest meal · 10 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'No post-lunch crash',
        description: 'Flatter glucose means steadier afternoon energy.',
      },
      {
        icon: 'leaf',
        title: 'Easier digestion',
        description: 'Gentle movement helps things move along.',
      },
      {
        icon: 'target',
        title: 'Steps without a workout',
        description: 'Daily movement that needs no gym or kit.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'A lighter afternoon',
        description: 'Many people feel the difference after the first walk.',
      },
      {
        when: 'Week 2',
        title: 'Meals feel unfinished without it',
        description: 'The walk becomes the natural end of eating.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Standing up after a meal stops being a decision.',
        peak: true,
      },
    ],
    howToStart: [
      'Ten minutes, easy pace — this is not a workout.',
      'Start within about 30 minutes of finishing your meal.',
      'Attach it to one meal first. Lunch is usually the easiest.',
    ],
    sources: [
      {
        authors: 'DiPietro L, et al.',
        title:
          'A simple postmeal walk reduces postprandial glucose excursions in type 2 diabetes',
        journal: 'PubMed',
        year: '2016',
        link: 'https://pubmed.ncbi.nlm.nih.gov/27747394/',
      },
    ],
  },
};
