
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
async function mongooseStart() {
    try {
        await mongoose.connect('mongodb://localhost:27017/yelp-camp');
        console.log("connected");
    }
    catch (err) {
        console.log(err)
    };

}

mongooseStart();
const sample = arr => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
    await Campground.deleteMany({});


    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const rand = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '6200f31a8c041b748836ddab',
            geometry: {
                "type": "Point",
                "coordinates": [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    "url": "https://res.cloudinary.com/dgsprfcew/image/upload/v1643905681/YelpCamp/cwazv0vzsc1ain5f2paj.jpg",
                    "filename": "YelpCamp/cwazv0vzsc1ain5f2paj"

                },
                {
                    "url": "https://res.cloudinary.com/dgsprfcew/image/upload/v1643905663/YelpCamp/tv2az6vwgh0y3l3uhzw0.jpg",
                    "filename": "YelpCamp/tv2az6vwgh0y3l3uhzw0"
                },
                {
                    "url": "https://res.cloudinary.com/dgsprfcew/image/upload/v1643905717/YelpCamp/qpqxcebdnwpevttzqlfw.jpg",
                    "filename": "YelpCamp/qpqxcebdnwpevttzqlfw"
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.Nemo sed, quasi, incidunt est neque, hic facere sit numquam odio  ipsa doloribus! Perferendis laboriosam quos pariatur repudiandae! Nam facilis expedita ut?",
            price: rand
        });
        await camp.save();
    }
};

seedDB().then(() => {
    console.log('Seed completed successfully!');
    mongoose.connection.close();
})