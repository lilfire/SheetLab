import HeaderBanner from '../modules/HeaderBanner/HeaderBanner';
import CharacterPortrait from '../modules/CharacterPortrait/CharacterPortrait';
import RaceClassInfo from '../modules/RaceClassInfo/RaceClassInfo';
import BackgroundInfo from '../modules/BackgroundInfo/BackgroundInfo';
import AbilityScores from '../modules/AbilityScores/AbilityScores';
import PassiveStats from '../modules/PassiveStats/PassiveStats';
import Inspiration from '../modules/Inspiration/Inspiration';
import SavingThrowsSkills from '../modules/SavingThrowsSkills/SavingThrowsSkills';
import CombatStats from '../modules/CombatStats/CombatStats';
import HPTracker from '../modules/HPTracker/HPTracker';
import ClassFeaturePrimary from '../modules/ClassFeaturePrimary/ClassFeaturePrimary';
import ClassFeatureSecondary from '../modules/ClassFeatureSecondary/ClassFeatureSecondary';
import RaceClassTraits from '../modules/RaceClassTraits/RaceClassTraits';
import SubclassFeats from '../modules/SubclassFeats/SubclassFeats';
import AbilitiesFeatures from '../modules/AbilitiesFeatures/AbilitiesFeatures';
import AttacksCantrips from '../modules/AttacksCantrips/AttacksCantrips';
import Equipment from '../modules/Equipment/Equipment';
import Proficiency from '../modules/Proficiency/Proficiency';

export const MODULE_REGISTRY = {
  headerBanner: { label: 'Header / Character Name', component: HeaderBanner },
  characterPortrait: { label: 'Character Portrait', component: CharacterPortrait },
  raceClassInfo: { label: 'Race and Class Info', component: RaceClassInfo },
  backgroundInfo: { label: 'Background', component: BackgroundInfo },
  abilityScores: { label: 'Ability Scores', component: AbilityScores },
  passiveStats: { label: 'Passive Stats', component: PassiveStats },
  inspiration: { label: 'Inspiration', component: Inspiration },
  savingThrowsSkills: { label: 'Saving Throws and Skills', component: SavingThrowsSkills },
  combatStats: { label: 'Combat Stats', component: CombatStats },
  hpTracker: { label: 'HP Tracker', component: HPTracker },
  classFeaturePrimary: { label: 'Class Feature (Primary)', component: ClassFeaturePrimary },
  classFeatureSecondary: { label: 'Class Feature (Secondary)', component: ClassFeatureSecondary },
  raceClassTraits: { label: 'Race and Class Traits', component: RaceClassTraits },
  subclassFeats: { label: 'Subclass Feats', component: SubclassFeats },
  abilitiesFeatures: { label: 'Abilities and Features', component: AbilitiesFeatures },
  attacksCantrips: { label: 'Attacks and Cantrips', component: AttacksCantrips },
  equipment: { label: 'Equipment', component: Equipment },
  proficiency: { label: 'Proficiencies', component: Proficiency },
};
