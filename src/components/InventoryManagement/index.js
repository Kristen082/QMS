import React, { Component } from 'react'
import "./index.css";
import { Table,Button, Input, Icon,Modal,Pagination,Select } from 'antd';
import Highlighter from 'react-highlight-words';
//可拉伸
import { Resizable } from 'react-resizable';
import "react-resizable/css/styles.css";
import axios from 'axios';
const { confirm } = Modal;
const { Option } = Select;
const InputGroup = Input.Group;

//tab
let tabType=-1;

//modal 暂存数据
let Process = null;
let est = null;
let dueDate = null;


//分页
let	data = null//表格内部数据
let pageIndex = 1;
let pageSize = 10;
let dataCount=null;//总条数

function onBlur() {
  console.log('blur');
}
function onFocus() {
  console.log('focus');
}

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

var check_List=[];//待办列表key
var check_all=[];//待办所有列表
function showConfirm() {//删除确认框
  confirm({
    title: 'Are you sure you want to release the projects?',
    content: 'Some descriptions',
    onOk() {
    console.log('投产')
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
      console.log(selectedRows,check_List)
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
    Detail_data:[],
    Detail_columns:[
      {
        title: 'SO/FO',
        dataIndex: 'isPLODetailForSOWhatIf',
        width: 130,
        sorter: (a, b) => a.isPLODetailForSOWhatIf.length - b.isPLODetailForSOWhatIf.length,
        ...self.getColumnSearchProps('isPLODetailForSOWhatIf'),
      },
      {
        title: 'SO No.',
        dataIndex: 'soNo',
        width: 130,
        sorter: (a, b) => a.soNo.length - b.soNo.length,
        ...self.getColumnSearchProps('soNo'),
      },
      {
        title: 'Line No.',
        dataIndex: 'soLinePartNo',
        width: 130,
        sorter: (a, b) => a.soLinePartNo.length - b.soLinePartNo.length,
        ...self.getColumnSearchProps('soLinePartNo'),
      },
      {
        title: 'Level',
        dataIndex: 'outputLevel',
        width: 130,
        sorter: (a, b) => a.outputLevel.length - b.outputLevel.length,
        ...self.getColumnSearchProps('outputLevel'),
      },
      {
        title: 'QTY',
        dataIndex: 'demQty',
        width: 130,
        sorter: (a, b) => a.demQty.length - b.demQty.length,
        ...self.getColumnSearchProps('demQty'),
      },{
        title: 'Customer Name',
        dataIndex: 'customerName',
        width: 130,
        sorter: (a, b) => a.customerName.length - b.customerName.length,
        ...self.getColumnSearchProps('customerName'),
      },
      {
        title: 'Due Date',
        dataIndex: 'workOrderNo',
        width: 130,
        sorter: (a, b) => a.workOrderNo.length - b.workOrderNo.length,
        ...self.getColumnSearchProps('workOrderNo'),
      },
      {
        title: 'Shipment Date',
        dataIndex: 'woDueDate',
        width: 130,
        sorter: (a, b) => a.woDueDate.length - b.woDueDate.length,
        ...self.getColumnSearchProps('woDueDate'),
      },
      {
        title: 'ECD',
        dataIndex: 'ecd',
        width: 130,
        sorter: (a, b) => a.ecd.length - b.ecd.length,
        ...self.getColumnSearchProps('ecd'),
      },


    ],
    columns: [
    {
      title: 'Item No',
      dataIndex: 'partNo',
      width: 130,
      sorter: (a, b) => a.partNo - b.partNo,
      ...self.getColumnSearchProps('partNo'),
		},
		{
			title:"QYT",
			dataIndex:"aTPQty",
			width:130,
			sorter:(a,b)=>a.aTPQty-b.aTPQty,
      ...self.getColumnSearchProps('aTPQty')
		},
		{
			title:"Allocated QTY",
			dataIndex:"allocatedQTY",
			width:130,
			sorter:(a,b)=>a.allocatedQTY-b.allocatedQTY,
      ...self.getColumnSearchProps('allocatedQTY')
		},
		{
			title:"ATP",
			dataIndex:"availableQOH",
			width:130,
			sorter:(a,b)=>a.availableQOH-b.availableQOH,
      ...self.getColumnSearchProps('availableQOH')
		},
	],
}
}
componentDidMount(){
	//渲染table(没有search)
	axios.post('/api/BaseInventory/GetStockList',{
    "isPagination": true,
    "currentPageNumber": pageIndex,
    "pageSize": pageSize,
    "sortExpression": [],
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
    console.log(res.data.data,'data')
    dataCount=res.data.dataCount
    
	})
	
		// tabArray.map((item,index)=>{
		// 	console.log(item)
		// 	axios.get(`/api/OrderRelease/GetWorkOrderList?orgId=${localStorage.getItem('orgID')}&pageIndex=${pageIndex}&pageSize=${pageSize}&selectType=${item}`).then(res=>{
		// 	if(item==="1"){
		// 		tabData1=res.data.data.data
		// 	}
		// 	else if(item==="5"){
		// 		tabData5=res.data.data.data
		// 	}
		// 	else if(item==="3"){
		// 		tabData3=res.data.data.data
		// 	}
		// })
		// })

}
showModal = () => {
  setTimeout(() => {//延迟
    this.setState({
      visible: true,
    });        
  }, 10);
  
};
handleOk = () => {
  this.setState({
    visible: false
  });

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
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
		//第二层表格
		const expandedRowRender = () => {
			const columns = [
				{ 
					title: 'Task No.',
					dataIndex: 'opNo',
					key: 'opNo',
					sorter: (a, b) => a.opNo.length - b.opNo.length,
					...this.getColumnSearchProps('opNo'),//搜索
					
				},
				{ 
					title: 'Task Desc',
					dataIndex: 'opName',
					key: 'opName',
					sorter: (a, b) => a.opName.length - b.opName.length,
					...this.getColumnSearchProps('opName'),
				},
				{ 
					title: 'Finished Percentage',
					dataIndex: 'Finished',
					key: 'Finished',
					sorter: (a, b) => a.Finished.length - b.Finished.length,
					...this.getColumnSearchProps('Finished'),
				},
				{ 
					title: 'Resource No.',
					dataIndex: 'resNo',
					key: 'resNo',
					sorter: (a, b) => a.resNo.length - b.resNo.length,
					...this.getColumnSearchProps('resNo'),
				},
				{ 
					title: 'Resource Group',
					dataIndex: 'resGroup',
					key: 'resGroup',
					sorter: (a, b) => a.resGroup.length - b.resGroup.length,
					...this.getColumnSearchProps('resGroup'),
				},
				{ 
					title: 'Allowed Resource',
					dataIndex: 'allowedRes',
					key: 'allowedRes',
					sorter: (a, b) => a.allowedRes.length - b.allowedRes.length,
					...this.getColumnSearchProps('allowedRes'),
				},
				{ 
					title: 'Standard Hours',
					dataIndex: 'standardHours',
					key: 'standardHours',
					sorter: (a, b) => a.standardHours.length - b.standardHours.length,
					...this.getColumnSearchProps('standardHours'),
				},
				{ 
					title: 'Applied Hours',
					dataIndex: 'appliedHours',
					key: 'appliedHours',
					sorter: (a, b) => a.appliedHours.length - b.appliedHours.length,
					...this.getColumnSearchProps('appliedHours'),
				},
				{ 
					title: 'Completed',
					dataIndex: 'completed',
					key: 'completed',
					sorter: (a, b) => a.completed.length - b.completed.length,
					...this.getColumnSearchProps('completed'),
				},
			];
			return <Table 
					columns={columns} 
					dataSource={subdata}
					pagination={false} //分页位置
				/>;
		};
    return (
      <div className="box">
				<div className="operation_btn">
          {/* 导入按钮 */}
					<div className="add">
					<Button 
						type="primary"
            onClick={()=>{
              console.log('export')
            }}>
            <Icon type="plus" />
              Export
          </Button>
					
					</div>
            {/* 导出按钮 */}
          <div className="Delete">
            <Button 
              onClick={()=>{
                  showConfirm()
              }}>
								<Icon type="highlight" />
              Release
            </Button>
          </div>
          </div>
          <div className="table">
						<div className="select_All" style={{margin:"8px 0"}}>
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
              <Button style={{height:30}} onClick={()=>{
                //数组(error)
                axios.get(`/api/OrderGeneration/GetWorkOrderList?orgId=${localStorage.getItem('orgID')}&DepNo=${DepNo}&ResNo=${ResNo}&pageIndex=${pageIndex}&pageSize=${pageSize}`).then(res=>{
                  data=res.data.data.data//复制给表格内容
                  console.log(res.data.data.data,'search')
                    dataCount=res.data.data.dataCount
                })
              }}>Search</Button>
            </div>
        {/* <Tabs defaultActiveKey="-1" onChange={this.callback}> */}
          	<Table 
              rowSelection={rowSelection}
							bordered 
							size="small"
              scroll={{ x: "100%",y: "700px" }}
              components={this.components}
              columns={date} 
							pagination={false}
							expandedRowRender={
								(record, index, indent, expanded)=>{
									console.log(record.opsRelease)
									subdata=record.opsRelease
									return expandedRowRender()
								}
							}
              dataSource={data}
            />
				<div className="Pagination">
        <Pagination
          showSizeChanger
          size="small"
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





