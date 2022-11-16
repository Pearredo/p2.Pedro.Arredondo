//facecam globals
let capture;

//clock globals
let cx, cy;
let secondsRadius;
let hoursRadius;
let clockDiameter;

//date globals
let today;
let nowMonth;
let nowYear;
let schTable;

//weather globals
let jsonWeather;
let temp;
let windspeed;
let weatherTime;

//news globals
let jsonNews;
let articleTitle;
let articleDes;
let articleAuthor;
let articleDate;
let articleImage;
let c=0;

//sleep globals
let schSleep;
let sc=0;

function preload(){
  //load schedule
  schTable = loadTable('Schedule_TTH - Sheet1.csv','csv','header');
  schSleep = loadTable('sleep_tracker - Sheet1.csv','csv','header');
  
  //load weather
  let weatherURL = 'https://api.open-meteo.com/v1/forecast?latitude=33.59&longitude=-101.94&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago';
  jsonWeather = loadJSON(weatherURL);
  
  jsonNews = loadJSON('news_json.json');
}

function setup() {
  createCanvas(1280, 720);
  angleMode(DEGREES);
  
  //facecam background
  capture = createCapture(VIDEO);
  capture.size(1280,720);
  capture.hide();
  
  //setup clock
  clockDiameter = 200;
  cx = 200/2 +15;
  cy = 200/2 +15;
  
  //setup date
  today = day();
  nowMonth = month();
  nowYear = year();
  
  //setup weather
  temp = jsonWeather.current_weather.temperature;
  windspeed = jsonWeather.current_weather.windspeed;
  weatherTime = jsonWeather.current_weather.time;
  
}

function draw() {
  if(c == jsonNews.totalResults -2){
      c=0;
    }
  if(frameCount % 300 == 0){
    
    c++;
  }
  
  //facecam background
  image(capture,0,0,1280,720);
  
  //get time
  let hr = hour();
  let minu = minute();
  let sec = second();
  
  //draw clock
  noStroke();
  fill(204,249,255,50);
  ellipse(cx,cy, clockDiameter+25,clockDiameter+25);
  fill(124,232,255,50);
  ellipse(cx,cy,clockDiameter,clockDiameter);
  fill(0,128,191);
  textSize(48);
  textAlign(CENTER,CENTER);
  text(hr+":"+minu+":"+sec,cx,cy);
  
  //draw today's calendar
  fill(246,189,192,50);
  rect(920,0,360,270,50);
  fill(200,28,19);
  textSize(18);
  text(nowMonth+"/"+today+"/"+nowYear,1100,24);
  
  let counter = 72;
  for(let r=0;r<schTable.getRowCount();r++)
      for(let c1=0; c1<schTable.getColumnCount();c1++){
        fill(255);
        rect(970,counter-10,260,20,10);
        fill(200,28,19);
        text(schTable.getString(r,c1),1100,counter);
        counter = counter + 24;
      }
  
  //draw weather
  fill(197,232,183,50);
  rect(0,680,560,40,25);
  textSize(24);
  fill(46,182,44);
  text("Lubbock "+temp+"F "+windspeed+"mph "+weatherTime,280,700);
  
  //draw news
  fill(0,11,24,50);
  rect(0,225,560,450,75);
  fill(0,82,162);
  text("The News",280,250);
  textSize(16)
  
  try{
    articleTitle = jsonNews.articles[c].title;
    articleDes = jsonNews.articles[c].description;
    articleAuthor = jsonNews.articles[c].author;
    articleDate = jsonNews.articles[c].publishedAt;
    text(articleTitle,0,275,560,50);
    text(articleDes,0,325,560,75);
    text(articleAuthor + " - " + articleDate,0,400,560,25)
    
    
  }catch(error){
    console.log(error);
    c++;
  }
  
  stroke(0,38,77);
  line(25,425,535,425);

  noStroke();
  
  try{
    articleTitle = jsonNews.articles[c+1].title;
    articleDes = jsonNews.articles[c+1].description;
    articleAuthor = jsonNews.articles[c+1].author;
    articleDate = jsonNews.articles[c+1].publishedAt;
    text(articleTitle,0,450,560,50);
    text(articleDes,0,500,560,75);
    text(articleAuthor + " - " + articleDate,0,575,560,25)
  }catch(error){
    console.log(error);
    c++;
  }
  
  fill(255, 191, 15,50);
  rect(920,270,360,270,50);
  fill(82, 76, 176);
  let inc = 310;
  let sum=0;
  let ind=0;
  for(let r=0; r<schSleep.getRowCount();r++){
    for(let c1=0;c1<schSleep.getColumnCount();c1++){
      if(c1==0){
        text(schSleep.getString(r,c1),970,inc);
      }else{
        text(schSleep.getString(r,c1),1020,inc);
        inc+=25;
        sum+=Number(schSleep.getString(r,c1));
        ind++;
      }
    }
  }
  let avg = sum/ind;
  text('Average hours of sleep = '+avg,1070,310,160,170);
  
}
