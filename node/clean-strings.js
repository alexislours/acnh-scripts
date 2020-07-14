const fs = require('fs');
const lang = ['USen', 'EUen', 'EUde', 'EUes', 'USes', 'EUfr', 'USfr', 'EUit', 'EUnl'];
const langAll = ['USen', 'EUen', 'EUde', 'EUes', 'USes', 'EUfr', 'USfr', 'EUit', 'EUnl', 'CNzh', 'TWzh', 'JPja', 'KRko'];
const fileArray = [
    'Item/STR_ItemName_00_Ftr.csv',
    'Item/STR_ItemName_01_Art.csv',
    'Item/STR_ItemName_20_Tool.csv',
    'Item/STR_ItemName_30_Insect.csv',
    'Item/STR_ItemName_31_Fish.csv',
    'Item/STR_ItemName_32_DiveFish.csv',
    'Item/STR_ItemName_33_Shell.csv',
    'Item/STR_ItemName_34_Fossil.csv',
    'Item/STR_ItemName_36_InsectToy.csv',
    'Item/STR_ItemName_37_FishToy.csv',
    'Item/STR_ItemName_40_Plant.csv',
    'Item/STR_ItemName_41_Turnip.csv',
    'Item/STR_ItemName_50_RoomWall.csv',
    'Item/STR_ItemName_51_RoomFloor.csv',
    'Item/STR_ItemName_52_RoomRug.csv',
    'Item/STR_ItemName_61_HouseDoorDeco.csv',
    'Item/STR_ItemName_62_HousePost.csv',
    'Item/STR_ItemName_70_Craft.csv',
    'Item/STR_ItemName_80_Etc.csv',
    'Item/STR_ItemName_81_Event.csv',
    'Item/STR_ItemName_82_Music.csv',
    'Item/STR_ItemName_83_Fence.csv',
    'Item/STR_ItemName_84_Bromide.csv',
    'Item/STR_ItemName_85_BridgeSlope.csv',
    'Item/STR_ItemName_86_Poster.csv',
    'Item/STR_ItemName_90_Money.csv',
    'Outfit/GroupName/STR_OutfitGroupName_Accessory.csv',
    'Outfit/GroupName/STR_OutfitGroupName_Bag.csv',
    'Outfit/GroupName/STR_OutfitGroupName_Bottoms.csv',
    'Outfit/GroupName/STR_OutfitGroupName_Cap.csv',
    'Outfit/GroupName/STR_OutfitGroupName_Helmet.csv',
    'Outfit/GroupName/STR_OutfitGroupName_MarineSuit.csv',
    'Outfit/GroupName/STR_OutfitGroupName_OnePiece.csv',
    'Outfit/GroupName/STR_OutfitGroupName_Shoes.csv',
    'Outfit/GroupName/STR_OutfitGroupName_Socks.csv',
    'Outfit/GroupName/STR_OutfitGroupName_Tops.csv',
]

fileArray.forEach(file => {
    cleanCSV(file);
});

fileArray.forEach(file => {
    mergeFiles(file);
});

function mergeFiles(file) {
    let csvPathArray = [];
    langAll.forEach(lan => {
        csvPathArray.push(`./in/String_${lan}/${file}`)
    });
    let out = [];
    csvPathArray.forEach(function (path, filenum) {
        let csv = fs.readFileSync(path).toString().split("\n");
        csv.forEach(function (line, index) {
            if (index == 0) {
                if (filenum < 1) {
                    out.push(line);
                } else {
                    out[index] += "," + langAll[filenum];
                }
            } else {
                if (filenum < 1) {
                    out.push(line);
                } else {
                    out[index] += "," + line.split('",')[1]
                }
            }
        });
        var n = path.lastIndexOf('/');
        var result = path.substring(n + 1);
        fs.writeFileSync("./out/" + result, out.join('\n'));
    });
}

function cleanCSV(file) {
    let csvPathArray = [];
    lang.forEach(lan => {
        csvPathArray.push(`./in/String_${lan}/${file}`)
    });
    csvPathArray.forEach(path => {
        console.log(path)
        let f = fs.readFileSync(path).toString('hex');
        f = f.replace(/(0e32........8.ecb48.|0e321a040.ecb484|0e32160d0a5c305c305c300273|0e32160d0a5c305c30026e|0e325c3004e0a082ecb486|0e3216145c3004656e04656e04656e|0e32160c5c305c305c30046573|c2a026202de281a0726f6d70)/g, '');
        let result = Buffer.from(f, "hex")
        fs.writeFileSync(path, result);
    });
}
