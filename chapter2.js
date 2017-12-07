// webstorm 에서 이 블로그 따라 해야지 동작함
// https://blog.jetbrains.com/webstorm/2015/05/ecmascript-6-in-webstorm-transpiling/#babelfilewatcher

import fs from 'fs'
import csv from 'fast-csv'
import _ from 'lodash'

// load data 1~4호선 데이터
const stream = fs.createReadStream("../data/2017년_4월_역별_일별_시간대별_승하차인원.csv");
const data = [];
const csvStream = csv()
    .on("data", function (each) {
        data.push(each);
    })
    .on("end", function () {

        // filter
        // 4월 1일자 승차 정보만 필터
        console.log(_.chain(data).filter(each => _.isEqual(each[2], "승차")).filter(each => _.isEqual(each[1], "2017-04-01")).size().value());

        // reject
        // 4월 1일자인데, 승차 정보가 아닌것들
        console.log(_.chain(data).reject(each => _.isEqual(each[2], "승차")).filter(each => _.isEqual(each[1], "2017-04-01")).size().value());

        //find, 첫번째 element만 찾고 멈춤
        console.log(_.chain(data).find(each => _.isEqual(each[1], "2017-04-01") && _.isEqual(each[2], "승차")).value());

        //partition 출근시간 하차량 (08~10) 이 5000이 넘는 역과 아닌역을 구분
        const partitioned = _.chain(data).filter(each => _.isEqual(each[1], "2017-04-01") && _.isEqual(each[2], "하차")).partition(each => parseInt(each[6]) + parseInt(each[7]) < 5000).value();


        //partition 출근시간 승차량 (08~10) 이 5000이 넘는 역과 아닌역을 구분
        const partitioned2 = _.chain(data).filter(each => _.isEqual(each[1], "2017-04-01") && _.isEqual(each[2], "승차")).partition(each => parseInt(each[6]) + parseInt(each[7]) < 5000).value();

        //takeWhile, 조건이 맞는 첫번째를 return
        //dropWhile, 조건이 맞는 첫번쨰를 뺌


        //map
        // 출근시간 하차량이 5000이 넘는 역명을 출력해봄
        console.log(_.chain(_.last(partitioned)).map(each => each[0]).value());

        // 출근시간 승차량이 5000이 넘는 역명을 출력해봄
        console.log(_.chain(_.last(partitioned2)).map(each => each[0]).value());

        // 4월 1일자에 5시에 1000명 이상이 승차한 역의 이름을 찾자
        console.log(_.chain(data).filter(each => _.isEqual(each[2], "승차")).filter(each => _.isEqual(each[1], "2017-04-01")).filter(each => parseInt(each[3]) >= 1000).map(each => each[0]).value());


        //reduce
        // 1~4호선에서 4월 1일자에 승차한 전체 인원 vs 4월 1일자에 하차한 전체 인원

        const sumAllForRow = each => _.chain(_.slice(each, 3)).map(n => parseInt(n)).sum().value(); // lodash에는 sum이라는 macro가 미리 존재함
        // 승차
        console.log(_.chain(data).filter(each => _.isEqual(each[2], "승차")).filter(each => _.isEqual(each[1], "2017-04-01")).map(sumAllForRow).reduce((sum, n) => sum + n).value());
        // 하차
        console.log(_.chain(data).filter(each => _.isEqual(each[2], "하차")).filter(each => _.isEqual(each[1], "2017-04-01")).map(sumAllForRow).reduce((sum, n) => sum + n).value());

        // 승차 (계산 순서 꺼꾸로)
        console.log(_.chain(data).filter(each => _.isEqual(each[2], "승차")).filter(each => _.isEqual(each[1], "2017-04-01")).map(sumAllForRow).reduceRight((sum, n) => sum + n).value());
        // 하차 (계산 순서 꺼꾸로)
        console.log(_.chain(data).filter(each => _.isEqual(each[2], "하차")).filter(each => _.isEqual(each[1], "2017-04-01")).map(sumAllForRow).reduceRight((sum, n) => sum + n).value());

        const number = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // reduce와 reduceRight 차이
        // 9! 계산
        console.log(_.chain(number).reduce((ret, n) => ret * n).value());
        // 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 계산
        console.log(_.chain(number).reduce((ret, n) => ret / n).value());
        // 9 / 8 / 7 / 6 / 5 / 4 / 3 / 2 / 1 계산
        console.log(_.chain(number).reduceRight((ret, n) => ret / n).value());

        const array = [[0, 1], [2, 3], [4, 5]];
        console.log(_.reduce(array, function(flattened, other) {
            return flattened.concat(other);
        }, []));
        console.log(_.reduceRight(array, function(flattened, other) {
            return flattened.concat(other);
        }, []));

        // fold
        // 초기값이 있는 reduce, lodash에서는 reduce가 같은 역할을 함
        // 1 / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 계산
        console.log(_.chain(number).reduce((ret, n) => ret / n, 1).value());
        // 1 / 9 / 8 / 7 / 6 / 5 / 4 / 3 / 2 / 1 계산
        console.log(_.chain(number).reduceRight((ret, n) => ret / n, 1).value());


    });

stream.pipe(csvStream);
