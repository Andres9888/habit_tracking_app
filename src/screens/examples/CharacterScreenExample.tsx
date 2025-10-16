import CharacterScreen from '../CharacterScreen';

export default function CharacterScreenExample() {
  return <CharacterScreen onBack={() => console.log('Back pressed')} />;
}
