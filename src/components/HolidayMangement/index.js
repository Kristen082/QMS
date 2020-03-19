import React, { Component } from 'react'
import "./index.css";
import { Table,Button, Input, Icon,Modal,Pagination,Select,Tabs,DatePicker,message } from 'antd';
import Highlighter from 'react-highlight-words';
//可拉伸
import { Resizable } from 'react-resizable';
import "react-resizable/css/styles.css";
import axios from 'axios';
const { confirm } = Modal;
const { Option } = Select;
const InputGroup = Input.Group;

const { TabPane } = Tabs;
//tab
let tabType=-1;

//modal 暂存数据
let Process = null;
let est = null;
let dueDate = null;


//分页
let tabArray=['1','-1','5','3'];
let	data = null//表格内部数据
let tabData1=null;
let tabData3=null;
let tabData5=null;
let pageIndex = 1;
let pageSize = 10;
let dataCount=null;//总条数

function onBlur() {
  console.log('blur');
}
function onFocus() {
  console.log('focus');
}
//警示框
const warning = () => {
  message.warning('Please check the button');
};
//显示总页数
function showTotal(total) {
return `Total ${total} items`;
}
//数字选择器
function onChange(value) {
  console.log('changed', value,this);
}
//伸展table
const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} 
    scroll={{ x: true, y: true }}
    />;
  }
return (
  <Resizable
    width={width}
    height={0}
    onResize={onResize}
    minConstraints={[80, 70]}
    draggableOpts={{ enableUserSelectHack: true }}
  >
    <th {...restProps} />
  </Resizable>
  );
};

// 自定义(弹框)
let searchKeyWordDataType=null;
function setDataType(value) {
  console.log(value,'111111111')
    searchKeyWordDataType=value
    console.log(searchKeyWordDataType,'searchKeyWordDataType')
}
var check_res=[]

const rowSelection_res = {
  onChange: (selectedRowKeys, selectedRows) => {
    check_res=selectedRowKeys;
    console.log(check_res)
  },
  getCheckboxProps: record => ({
    disabled: record.No === 'Disabled User', // 静用 checked
    No: record.No,
  }),
};
let res_data=[]//资源表格内容

var check_List=[];//待办列表key
var check_all=[];//待办所有列表
function showConfirm() {//删除确认框
  confirm({
    title: 'Are you sure you want to Delete data?',
    content: 'Some descriptions',
    onOk() {
    axios.post("/api/BaseHoliday/HolidayDelete",{
      "pId": "10",
      "oIds":check_res
    }).then((res)=>{
      console.log(res.data.returnMessage)
    })
	},
  onCancel() {
    console.log('Cancel');
  },
  });
}

//checkbox选中框
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    //selectedRowKeys单个下标 selectedRows整体数组
    check_all=selectedRows

    // check_List=selectedRowKeys;
    if(selectedRows.length){
      selectedRows.map((item)=>{
        check_List.push({
          resID:item.resID,
          depID:item.depID
        })
      })
      console.log(selectedRows)
    }else{
      check_List=[]
    }
  },
  getCheckboxProps: record => ({
    disabled: record.No === 'Disabled User', // 静用 checked
    No: record.No,
  }),
};
let subdata=null;
export default class User extends Component {
  constructor(props) {
    super(props)
    const self = this; 
    this.state = {
    // searchKeyWordDataType:null,//自定义
    processNo:null,
    partNo:null,
    flag:null,
		sunIndex:null,
    //筛选option
    DepNo:"",
    ResNo:"",    
		ModalText: 'Content of the modal',
		visible: false,
		confirmLoading: false,
    searchText: '',
    searchedColumn: '',
    sortedInfo: null,
    Option_data:[],
    columns: [
      {
        title:"",
        dataIndex:"edit",
        width:20,
        render:()=><a 
          style={{textAlign:'center'}} 
          onClick={()=>{this.showModal(false)}}
        >edit</a>
      },
		{
			title:"Holiday Desc",
			dataIndex:"holidayDesc",
			width:130,
			sorter:(a,b)=>a.holidayDesc-b.holidayDesc,
      ...self.getColumnSearchProps('holidayDesc')
    },
    {
			title:"Start Date",
			dataIndex:"startTime",
			width:130,
			sorter:(a,b)=>a.startTime-b.startTime,
      ...self.getColumnSearchProps('startTime')
		},
		{
			title:"Stop Time",
			dataIndex:"stopTime",
			width:130,
			sorter:(a,b)=>a.stopTime-b.stopTime,
      ...self.getColumnSearchProps('stopTime')
		},
	],
}
}

componentDidMount(){
	//渲染table(没有search)
	axios.post('/api/BaseHoliday/GetHolidayList',{
    "isPagination": true,
    "currentPageNumber": pageIndex,
    "pageSize": pageSize,
    "sortExpression": ["string"],
    "sortDirection": true,
    "searchExpressionList": [
      {
        "SearchColumn": "orgID",
        "SearchValue": localStorage.getItem('orgID'),
        "SearchOperator": "=",
        "SearchParallel": "And"
      }
    ]
  }).then(res=>{
    data=res.data.data//复制给表格内容
  })
  
	axios.post('/api/BaseResource/GetResourceList',{
    "isPagination": true,
    "currentPageNumber": this.state.pageIndex,
    "pageSize": this.state.pageSize,
    "orgId":10,
    "sortExpression": [],
    "sortDirection": true,
    "searchExpressionList": [
      {
        "SearchColumn": "orgID",
        "SearchValue": "10",
        "SearchOperator": "=",
        "SearchParallel": ""
      }
    ]
  }).then(res=>{
    console.log(res.data.data)
    res_data=res.data.data
  })
		

}
showModal = (flag) => {
  setTimeout(() => {//延迟
    this.setState({
      visible: true,
      flag:flag
    });        
  }, 10);
};
handleOk = () => {
  let {StartDate,endDate,calName}=this.state
  this.setState({
    visible: false
  });
  console.log(this.state.flag)
  axios.post("/api/BaseHoliday/HolidayAdd",{
    "holidayDesc": calName,
    "startTime": StartDate,
    "stopTime": endDate,
    "orgID": "10",
    "resIdList": check_res
  }).then((res)=>{
    console.log(res.data)
  })
}
handleCancel=()=>{
  this.setState({
    visible: false
  });

}
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };
    getColumnSearchProps = dataIndex => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} style={{ width: 90 }}>
          Reset
        </Button>
      </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
        
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
      render: text =>
        this.state.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    });
    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
    
  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
      ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };
    //分页显示点击页数
    onChange(pageNumber){
      console.log('Page: ', pageNumber);
      console.log(this.self,5)
    }
    // 自定义
    setDataType(value) {
      this.setState({
        searchKeyWordDataType: value
      });
   }
  //tab框
	callback(key) {
		console.log(key)
	}
  render() {
		const { visible,confirmLoading,searchKeyWordDataType,Option_data,DepNo,ResNo } = this.state;
    const date = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));  
    let res_head=[
      {
        title: 'Resource No .',
        dataIndex: 'resNo',
        key: 'resNo',
        editable: true,
        ...this.getColumnSearchProps('resNo'),
      },
      {
        title: 'Resource Desc',
        dataIndex: 'resDesc',
        key: 'resDesc',
        ...this.getColumnSearchProps('resDesc'),
      }
    ]
		//第二层表格
		const expandedRowRender = () => {
			const columns = [
				
			
				{
          title: 'Resource No',
          dataIndex: 'resNo',
          width: 130,
          sorter: (a, b) => a.resNo.length - b.resNo.length,
          ...this.getColumnSearchProps('resNo'),
        },
        {
          title: 'Resource Desc',
          dataIndex: 'resDesc',
          width: 130,
          sorter: (a, b) => a.resDesc.length - b.resDesc.length,
          ...this.getColumnSearchProps('resDesc'),
        }
			];
			return <Table 
					columns={columns} 
					dataSource={subdata}
					pagination={false} //分页位置
				/>;
		};
    return (
      <div className="box">
					<div className="operation_btn" style={{marginBottom:'10px'}}>
              {/* 添加按钮 */}
							<div className="add">
							<Button 
                onClick={()=>{
                  this.showModal(true)
                }}>
                  Add
              </Button>
              <Modal
                title="Calendar Information"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
              <div className="card-container">
              <Tabs type="card" onChange={this.callback}>
                <TabPane tab="General" key="1">
              <div>
                <span style={{color:"red"}}>*</span>Calendar Name
                <InputGroup size="default" >
                    <Input placeholder="default size" style={{ width: '50%' }} 
                  onChange={(e)=>{
                  // console.log(e.target.value,'Calendar Name')
                  this.setState({
                    calName:e.target.value
                  })
                }}/>
                </InputGroup>
              </div>

              <div>
                   <span style={{color:"red"}}>*</span>Start Date
                   <InputGroup size="default">
                     <DatePicker style={{ width: '50%' }} onChange={(e)=>{
                      //  d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
                       this.setState({
                         StartDate:e._d
                       })
                     }}/>
                   </InputGroup>
              </div>
                <div>
                  <span style={{color:"red"}}>*</span>Stop Date
                  <InputGroup size="default">
                    <DatePicker style={{ width: '50%' }} onChange={(e)=>{
                      // console.log(e._d,'end Date')
                      this.setState({
                        endDate:e._d
                      })
                    }}/>
                  </InputGroup>
                </div>
            </TabPane>
            <TabPane tab="Resource" key="2">
              <Table 
              rowSelection={rowSelection_res}
              bordered 
              scroll={{ x: "100%",y: "700px" }}
              components={this.components} 
              columns={res_head} 
              pagination={false}
              dataSource={res_data}
            />
            </TabPane>
        </Tabs>
        </div>
      </Modal>
			</div>
      {/* 删除按钮 */}
      <div className="Delete">
        <Button 
          onClick={()=>{
          if(check_List.length){
           showConfirm()
          }else{
          warning()
          }
         }}>
          Delete
         </Button>
        </div>
      </div>
          <div className="table">
						<div className="select_All">
            <b>Project No.</b>
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode}//不添加位移
              showSearch
              filterOption={false}
              style={{ width: 200 }}
              optionFilterProp="children"
              onChange={(value)=>{
                console.log(value,'DepNo')
                this.setState({
                  DepNo:value
                })
              }}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={value => this.setDataType(value)}
            >
            {
              searchKeyWordDataType ? 
              <Option value={searchKeyWordDataType} >{searchKeyWordDataType}</Option> : ''
            }
            {
              Option_data.map((item,index)=>{
              return <Option value={item.partNo} key={item.partID} onClick={()=>{
                console.log(item.partNo,'ResNo')
                this.setState({
                  ResNo:item.partNo
                })
              }}>{item.partNo}</Option>
              })
            }
            </Select>
              <b>Process No.</b>
              <Select
                getPopupContainer={triggerNode => triggerNode.parentNode}//不添加位移
                showSearch
                filterOption={false}
                style={{ width: 200 }}
                optionFilterProp="children"
                onChange={(value)=>{
                  console.log(value,'ResNo')
                  this.setState({
                    ResNo:value
                  })
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={value => this.setDataType(value)}
              >
              {
                searchKeyWordDataType ? 
                <Option value={searchKeyWordDataType} >{searchKeyWordDataType}</Option> : ''
              }
              {
                Option_data.map((item,index)=>{
                return <Option value={item.key} key={item.key} onClick={()=>{
                  this.setState({
                    DepNo:item.partNo
                  })
                }}>{item.partNo}</Option>
                })
              }
              </Select>
              <Button onClick={()=>{
                //数组(error)
                axios.get(`/api/OrderGeneration/GetWorkOrderList?orgId=${localStorage.getItem('orgID')}&DepNo=${DepNo}&ResNo=${ResNo}&pageIndex=${pageIndex}&pageSize=${pageSize}`).then(res=>{
                  data=res.data.data.data//复制给表格内容
                  console.log(res.data.data.data,'search')
                    dataCount=res.data.data.dataCount
                })
              }}>Search</Button>
            </div>
          	<Table 
              rowSelection={rowSelection}
							bordered 
              components={this.components}
              columns={date} 
							pagination={false}
							expandedRowRender={
								(record, index, indent, expanded)=>{
									console.log(record.horesList)
									subdata=record.horesList
									return expandedRowRender()
								}
							}
              dataSource={data}
            />
					
				<div className="Pagination">
        <Pagination
          showSizeChanger
          onShowSizeChange={(current,newSize)=>{//改变当前页
            axios.get(`/api/OrderRelease/GetWorkOrderList?orgId=${localStorage.getItem('orgID')}&pageIndex=${pageIndex}&pageSize=${newSize}&selectType=${tabType}`).then(res=>{
							console.log(res.data.data,'页数',data)
              dataCount=res.data.data.dataCount
              
						})
          }}
          	showTotal={showTotal}//总页数展示
          	total={dataCount}
						onChange={(pageNumber)=>{//页数改变时
							console.log(pageNumber,111)
          	  axios.get(`/api/OrderRelease/GetWorkOrderList?orgId=${localStorage.getItem('orgID')}&pageIndex=${pageNumber}&pageSize=${pageSize}&selectType=${tabType}`).then(res=>{
								console.log(res.data.data,'工单列表+tab',data)
									dataCount=res.data.data.dataCount
							})
          	}}
          />
        </div>
    	</div>
      
    	</div>
      )
    }
  
   
}





