import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { Stats } from 'src/app/models/stats';
import { formatDate } from '@angular/common';
import { Count } from 'src/app/models/count';
import { Chart } from 'chart.js';
import { News } from 'src/app/models/news';
import { Router } from '@angular/router';
import { Tests } from 'src/app/models/tests';
import { Overview } from 'src/app/models/overview';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data: Stats[];
  stateData: Stats[];
  testData: Tests[];
  timeSeriesData: Overview[];
  lastWeekData: Overview;
  todayTestData: Tests;
  filteredStateData: Stats[];
  countDaily: Count[];
  news: News[];
  confirmedChartTotal = [];
  confirmedChart = [];
  recoveredChartTotal = [];
  recoveredChart = [];
  activeChartTotal = [];
  activeChart = [];
  deceasedChartTotal = [];
  deceasedChart = [];
  totalData: Stats;
  ascending: boolean;
  lastUpdateDate: Date = new Date();

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.totalData = new Stats()
    this.todayTestData = new Tests()
    this.lastWeekData = new Overview()
    this.data = []
    this.countDaily = []
    this.testData = []
    this.timeSeriesData = []
    this.ascending = true;
    this.dataService.getData().subscribe(
      data => {
        this.data = data['statewise'],
        this.testData = data['tested']
        this.timeSeriesData = data['cases_time_series']
        this.totalData = this.data.reverse().pop()
        this.todayTestData = this.testData[this.testData.length-1]
        this.lastWeekData = this.timeSeriesData[this.timeSeriesData.length - 7]
        this.data = this.data.sort((a,b) => a.confirmed - b.confirmed).reverse()
        this.stateData = this.data
        let temp = this.totalData.lastupdatedtime.split(" ");
        this.lastUpdateDate = new Date(temp[0][6]+temp[0][7]+temp[0][8]+temp[0][9]+'-'+temp[0][3]+temp[0][4]+'-'+temp[0][0]+temp[0][1]+"T"+temp[1])
      }
    )
    this.dataService.getCountDaily().subscribe(
      data => {
        this.countDaily = data['states_daily']
        //this.generateConfirmedChart(this.totalData.statecode)
        this.generateTotalChart()
      }
    )
    this.dataService.getLatestNews('india').subscribe(
      data => {
        this.news = data['items']
        this.news.sort((a,b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      }
    )
    Chart.defaults.global.defaultFontFamily = "'Lexend Deca', sans-serif"
  }

  filterState(searchText: string) {
    let states = this.stateData
    if(searchText !== "")
    {
      this.filteredStateData = states.filter(a => a.state.toLowerCase().startsWith(searchText.toLowerCase()))
    }
    else
    {
      this.filteredStateData = []
    }
  }

  navigate(path, data){
    this.router.navigateByUrl(path+"/"+data)
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
      stateCountConfirmed.push(data.tt)
      datesConfirmed.push(data.date)
    })
    this.countDaily.filter(data => data.status == 'Recovered').forEach(data => {
      stateCountRecovered.push(data.tt)
      datesRecovered.push(data.date)
    })
    this.countDaily.filter(data => data.status == 'Deceased').forEach(data => {
      stateCountDeceased.push(data.tt)
      datesDeceased.push(data.date)
    })
    for(let i = 0; i < stateCountConfirmed.length; i++){
      let temp_active = stateCountConfirmed[i] - stateCountRecovered[i] - stateCountDeceased[i]
      stateCountActive.push(temp_active)
      datesActive.push(datesConfirmed[i])
    }
    this.confirmedChartTotal = new Chart('confirmedTotal', {
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
    this.activeChartTotal = new Chart('activeTotal', {
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
    this.recoveredChartTotal = new Chart('recoveredTotal', {
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
    this.deceasedChartTotal = new Chart('deceasedTotal', {
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

  // generateConfirmedChart(stateCode: string) {
  //   let stateCount = []
  //   let dates = []
  //   this.countDaily.filter(data => data.status == 'Confirmed').forEach(data => {
  //     stateCount.push(data[stateCode.toLowerCase()])
  //     dates.push(data.date)
  //   })
  //   this.confirmedChart = new Chart('confirmed', {
  //     type: 'line',
  //     data: {
  //       labels: dates,
  //       datasets: [
  //         {
  //           showLine: true,
  //           data: stateCount,
  //           borderColor: "#ff073a",
  //           fill: false
  //         }
  //       ]
  //     },
  //     options: {
  //       elements: {
  //         point:{
  //           radius: 0,
  //           pointStyle: 'circle',
  //           backgroundColor: "#ff073a"
  //         }
  //       },
  //       tooltips: {
  //         mode: 'index',
  //         intersect: false
  //       },
  //       hover: {
  //         mode: 'index',
  //         intersect: false
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       legend: {
  //         labels: {
  //           defaultFontFamily: 'Lexend Deca',
  //         },
  //         display: false
  //       },
  //       scales: {
  //         xAxes: [{
  //           scaleShowLabels: false,
  //           display: true,
  //           ticks: {
  //             display: false,
  //           },
  //           gridLines: {
  //             display: false,
  //             color: "#ff073a"
  //           }
  //         }],
  //         yAxes: [{
  //           position: 'right',
  //           scaleShowLabels: false,
  //           display: true,
  //           ticks: {
  //             display: false,
  //           },
  //           gridLines: {
  //             display: false,
  //             color: "#ff073a"
  //           }
  //         }],
  //       }
  //     }
  //   })
  // }

  changeOrder() {
    this.ascending = !this.ascending
    this.data.reverse()
  }

  openLink(url: string) {
    window.open(url, "_blank");
  }
}
