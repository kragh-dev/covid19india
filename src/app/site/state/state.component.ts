import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stats } from 'src/app/models/stats';
import { DataService } from 'src/app/service/data.service';
import { News } from 'src/app/models/news';
import { Count } from 'src/app/models/count';
import { Chart } from 'chart.js';
import { StateTests } from 'src/app/models/state-tests';
import { DatePipe } from '@angular/common';
import { StateCount } from 'src/app/models/state-count';
import { StateService } from 'src/app/service/state.service';
import { State } from 'src/app/models/state';
import { AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { District } from 'src/app/models/district';
import { StateDistrictCount } from 'src/app/models/state-district-count';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {

  stateCode: string
  data: Stats[];
  stateDataFb: State;
  districts: District[];
  newsError = true;
  stateData: Stats;
  news: News[];
  countDaily: Count[];
  confirmedChartState = [];
  confirmedChart = [];
  recoveredChartState = [];
  recoveredChart = [];
  activeChartState = [];
  activeChart = [];
  deceasedChartState = [];
  deceasedChart = [];
  lastUpdateDate: Date = new Date();
  allStateTestData: StateTests[]
  stateTestData: StateTests[]
  latestTestData: StateTests
  confirmedCountData: Count[]
  lastWeekDataConfirmed: number
  ascending: boolean;
  isDonate: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private stateDataService: StateService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.stateCode = this.activatedRoute.snapshot.paramMap.get('statecode');
    this.stateData = new Stats()
    this.latestTestData = new StateTests()
    this.stateDataFb = new State()
    this.districts = []
    this.stateDataService.getStateData(this.activatedRoute.snapshot.paramMap.get('statecode')).subscribe(
      data => {
        this.stateDataFb = data[this.activatedRoute.snapshot.paramMap.get('statecode').toLowerCase()]
      }
    )
    this.dataService.getData().subscribe(
      data => {
        this.data = data['statewise']
        this.stateData = this.data[this.data.findIndex(a => a.statecode === this.stateCode)]
        let temp = this.stateData.lastupdatedtime.split(" ");
        this.lastUpdateDate = new Date(temp[0][6]+temp[0][7]+temp[0][8]+temp[0][9]+'-'+temp[0][3]+temp[0][4]+'-'+temp[0][0]+temp[0][1]+"T"+temp[1])
        this.dataService.getStateTestData().subscribe(
          data => {
            this.allStateTestData = data['states_tested_data']
            this.stateTestData = this.allStateTestData.filter(a => a.state === this.stateData.state)
            this.latestTestData = this.stateTestData[this.stateTestData.length - 1]
          }
        )
        this.dataService.getLatestNews(this.stateData.state.replace(" ","")).subscribe(
          data => {
            this.newsError = false
            this.news = data['items']
            this.news.sort((a,b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
          },
          error => {
            this.newsError = true
          }
        )
      }
    )
    this.dataService.getCountDaily().subscribe(
      data => {
        this.countDaily = data['states_daily']
        this.generateTotalChart()
      }
    )
    this.dataService.getTimeSeriesData().subscribe(
      data => {
        let todayDate = new Date()
        let lastWeekDate = new Date()
        let todayConfirmed = data[this.stateCode][this.datePipe.transform(todayDate, 'yyyy-MM-dd')]
        if(!todayConfirmed)
        {
          todayDate.setDate(todayDate.getDate() - 1)
        }
        lastWeekDate.setDate(todayDate.getDate() - 6)
        this.lastWeekDataConfirmed = data[this.stateCode][this.datePipe.transform(lastWeekDate, 'yyyy-MM-dd')]['total']['confirmed']
      }
    )
    this.dataService.getDistrictData().subscribe(
      data => {
        let states: StateDistrictCount[] = []
        states = <StateDistrictCount[]>data
        let state: StateDistrictCount = states.find(a => a.statecode === this.activatedRoute.snapshot.paramMap.get('statecode'))
        this.districts = state.districtData
        this.districts.sort((a,b) => b.confirmed - a.confirmed);
      }
    )
  }

  generateTotalChart() {
    let stateCountConfirmed = []
    let datesConfirmed = []
    let stateCountRecovered = []
    let datesRecovered = []
    let stateCountDeceased = []
    let datesDeceased = []
    let stateCountActive = []
    let datesActive = []
    this.countDaily.filter(data => data.status == 'Confirmed').forEach(data => {
      stateCountConfirmed.push(data[this.activatedRoute.snapshot.paramMap.get('statecode').toLowerCase()])
      datesConfirmed.push(data.date)
    })
    this.countDaily.filter(data => data.status == 'Recovered').forEach(data => {
      stateCountRecovered.push(data[this.activatedRoute.snapshot.paramMap.get('statecode').toLowerCase()])
      datesRecovered.push(data.date)
    })
    this.countDaily.filter(data => data.status == 'Deceased').forEach(data => {
      stateCountDeceased.push(data[this.activatedRoute.snapshot.paramMap.get('statecode').toLowerCase()])
      datesDeceased.push(data.date)
    })
    for(let i = 0; i < stateCountConfirmed.length; i++){
      let temp_active = stateCountConfirmed[i] - stateCountRecovered[i] - stateCountDeceased[i]
      stateCountActive.push(temp_active)
      datesActive.push(datesConfirmed[i])
    }
    this.confirmedChartState = new Chart('confirmedState', {
      type: 'line',
      data: {
        labels: datesConfirmed,
        datasets: [
          {
            data: stateCountConfirmed,
            borderColor: "#ff073a",
            fill: false
          }
        ]
      },
      options: {
        elements: {
          point:{
            radius: 0
          }
        },
        maintainAspectRatio: false,
        legend: {
          labels: {
            defaultFontFamily: 'Lexend Deca',
          },
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            scaleShowLabels: false,
            display: true,
            ticks: {
              display: false,
              autoSkip: true,
              maxTicksLimit: 20
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            scaleShowLabels: false,
            display: true,
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }],
        }
      }
    })
    this.activeChartState = new Chart('activeState', {
      type: 'line',
      data: {
        labels: datesConfirmed,
        datasets: [
          {
            data: stateCountActive,
            borderColor: "#007bff",
            fill: false
          }
        ]
      },
      options: {
        elements: {
          point:{
            radius: 0
          }
        },
        maintainAspectRatio: false,
        legend: {
          labels: {
            defaultFontFamily: 'Lexend Deca',
          },
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            scaleShowLabels: false,
            display: true,
            ticks: {
              display: false,
              autoSkip: true,
              maxTicksLimit: 20
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            scaleShowLabels: false,
            display: true,
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }],
        }
      }
    })
    this.recoveredChartState = new Chart('recoveredState', {
      type: 'line',
      data: {
        labels: datesConfirmed,
        datasets: [
          {
            data: stateCountRecovered,
            borderColor: "#28a745",
            fill: false
          }
        ]
      },
      options: {
        elements: {
          point:{
            radius: 0
          }
        },
        maintainAspectRatio: false,
        legend: {
          labels: {
            defaultFontFamily: 'Lexend Deca',
          },
          display: false
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          xAxes: [{
            scaleShowLabels: false,
            display: true,
            ticks: {
              display: false,
              autoSkip: true,
              maxTicksLimit: 20
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            scaleShowLabels: false,
            display: true,
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }],
        }
      }
    })
    this.deceasedChartState = new Chart('deceasedState', {
      type: 'line',
      data: {
        labels: datesDeceased,
        datasets: [
          {
            data: stateCountDeceased,
            borderColor: "#6c757d",
            fill: false
          }
        ]
      },
      options: {
        elements: {
          point:{
            radius: 0
          }
        },
        maintainAspectRatio: false,
        legend: {
          labels: {
            defaultFontFamily: 'Lexend Deca',
          },
          display: false
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          xAxes: [{
            scaleShowLabels: false,
            display: true,
            ticks: {
              display: false,
              autoSkip: true,
              maxTicksLimit: 20
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            scaleShowLabels: false,
            display: true,
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }],
        }
      }
    })
  }

  openLink(url: string) {
    window.open(url, "_blank");
  }

  changeOrder() {
    this.ascending = !this.ascending
    this.districts.reverse()
  }

  onDonate() {
    this.isDonate = !this.isDonate
  }
}
