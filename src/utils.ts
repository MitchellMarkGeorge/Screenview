import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
 
const config: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  length: 3,
};


export function randomName() {
    return uniqueNamesGenerator(config);
}
 
