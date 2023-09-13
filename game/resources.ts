import { Loader, ImageSource } from 'excalibur'

const Images = {
    //character
    redSheetImage: new ImageSource('/sprites/character-red-sheet.png'),
    blueSheetImage: new ImageSource('/sprites/character-blue-sheet.png'),
    graySheetImage: new ImageSource('/sprites/character-gray-sheet.png'),
    yellowSheetImage: new ImageSource('/sprites/character-yellow-sheet.png'),
    
    //maps
    indoorImage: new ImageSource('/maps/indoor.png'),

    //weapons
    swordImage: new ImageSource('/sprites/sword-sheet.png'),
    arrowImage: new ImageSource('/sprites/arrow-sheet.png'),
} as const
const Sounds = {} as const


const loader = new Loader();
//loader.suppressPlayButton = true;

const allResources = {...Images, ...Sounds};
for(const res of Object.values(allResources)){
    loader.addResource(res);
}

export {loader, Images, Sounds}