import React, { Component } from 'react'

//语言
import intl from 'react-intl-universal'
const locales={
  "en-US":require('../locales/en-US.json'),
  "zh-CN":require('../locales/zh-CN.json')
}

class Index extends Component {
  state={
    initDone: false,
    currentLocale:"en-US",
    toggle:false
  }

  componentDidMount(){
    this.loadLocales()
  }

  loadLocales() {
    // react-intl-universal 是单例模式, 只应该实例化一次
    intl.init({
      currentLocale: this.state.currentLocale, // 提示: 更改区域在这里更改
      locales,
    }).then(() => {
	  this.setState({initDone: true});
    });
  }
    render() {
        return (
        this.state.initDone &&
        <div className="content_box">
          <div className="row_1">
            <div className="Build">
              <p className="titlefont">
              1. {intl.get('1.BuildBasicData')}
              </p>
              <p className="bodyfont">
                1.Available resources are initialized <br/>
                2.Manage resource calendars , holidays and downtime <br/>
                3.Manage new resources
              </p>
            </div>
            <div className="Create">
              <p className="titlefont">
                2. {intl.get('2.CreateJobs')}
              </p>
              <p className="bodyfont"> 1.Update to the most recent Job data</p>
            </div>
            <div className="Run">
              <p className="titlefont">
                3. {intl.get('3.RunSchedule')}
              </p>
              <p className="bodyfont">
                1.Generate an optimal scheduling sequence <br/>
                2.Review scheduling results
            </p>
            </div>
            </div>
            <div className="row_2">
              <div className="What">
                <p className="titlefont">
                    4. {intl.get('4.What-IfAnalysis')}
                </p>
                <p className="bodyfont">
                    1.Scenarios to achieve better schedule performance <br/>
                    2.Analyze impact of changes in the system
                </p>
              </div>
              <div className="Print">
                <p className="titlefont">
                    5. {intl.get('5.PrintDispatch')}
                </p>
                <p className="bodyfont">
                    1.Release desired schedule<br/>
                    2.Run dispatch report
                </p>
              </div>
              <div className="Manage">
                <p className="titlefont">
                    6. {intl.get('6.ManageProgress')}
                </p>
                <p className="bodyfont">
                  1.Review current progress on each job <br/>
                  2.Identify potential fields that may require further analysis(i.e. bottlenecks,machine breakdowns) <br/>
                  3.Reschedule or run what-if analysis if changes occur(i.e. hot jobs, major machine breakdowns)
              </p>
              </div>
            </div> 
          </div>
        )
    }
}
export default Index
