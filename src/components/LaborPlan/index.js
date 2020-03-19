import React, { Component } from 'react'
import "./index.css";
import { Table,Button,Form, Input, Icon,Modal,Pagination,Select,Tabs,message } from 'antd';
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
    axios.post("​/api​/BaseLaborPlan​/LaborPlanDelete",{
      "pId": "10",
      "oIds":check_res
    }).then((res)=>{
      console.log(res.data)
    })
	},
  onCancel() {
    console.log('Cancel');
  },
  });
}

//可编辑
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: false,
  };
  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };
  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };
  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };
  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
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
      work_head:[
        {
          title: 'Spans No.',
          dataIndex: 'spansNo',
          editable: true,
          width: 200,
        },{
          title: 'Start Date.',
          dataIndex: 'startDate',
          width: 200,
          editable: true,
        },{
          title: 'Stop Date',
          dataIndex: 'stopDate',
          editable: true,
          width: 200,
        }
      ],
    // searchKeyWordDataType:null,//自定义
    processNo:null,
    partNo:null,
    flag:null,
    count:1,
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
        title:'',
        dataIndex:'edit',
        width:30,
        render: () => <a>edit</a>
      },
      {
        title: 'Labor Group No.',
        dataIndex: 'employeeNum',
        width: 200,
        sorter: (a, b) => a.employeeNum - b.employeeNum,
        ...self.getColumnSearchProps('employeeNum'),
      },
      {
        title: 'Labor Group Desc.',
        dataIndex: 'employeeName',
        width: 150,
        sorter: (a, b) => a.employeeName - b.employeeName,
        ...self.getColumnSearchProps('employeeName'),
      },
      {
        title:'Resource',
        dataIndex:'detail',
        width:30,
        render: () => <a style={{textAlign:"center"}}>detail</a>
      },
    ],
    dataSource:[]
}
}
 //可编辑
 handleDelete = key => {
  const dataSource = [...this.state.dataSource];
  this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
};

handleAdd = () => {
  const { count, dataSource } = this.state;
  const newData = {
    key: `LaborPlan${count}`,
    "workingSpanNo": 'please enter name',
    "startTime":'please enter date',
    "stopTime":'please enter date'
  };
  this.setState({
    dataSource: [...dataSource, newData],
    count: count + 1,
  });
};

handleSave = row => {
  const newData = [...this.state.dataSource];
  const index = newData.findIndex(item => row.key === item.key);
  const item = newData[index];
  newData.splice(index, 1, {
    ...item,
    ...row,
  });
  this.setState({ dataSource: newData });
};
componentDidMount(){
	//渲染table(没有search)
	axios.post('/api/BaseLaborPlan/GetLaborPlanList',{
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
    console.log(res.data.data)
    this.setState({
      dataCount:res.data.totalRows
    })
    
    
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
  let {Desc,No,dataSource}=this.state
  this.setState({
    visible: false
  });
  console.log(this.state.dataSource)
  axios.post("/api/BaseLaborPlan/LaborPlanAdd",{
    "laborGroupNo": No,
    "laborGroupDesc": Desc,
    "orgID": localStorage.getItem('orgID'),
    "resID": check_res,
    "workSpanList": dataSource
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
    let work_head=[
      {
        title: 'Spans No .',
        dataIndex: 'spansNo',
        key: 'spansNo',
        editable: true,
        ...this.getColumnSearchProps('spansNo'),
      },
      {
        title:"Start Date",
        dataIndex:"startTime",
        width:130,
        sorter:(a,b)=>a.startTime-b.startTime,
        ...this.getColumnSearchProps('startTime')
      },
      {
        title:"Stop Time",
        dataIndex:"stopTime",
        width:130,
        sorter:(a,b)=>a.stopTime-b.stopTime,
        ...this.getColumnSearchProps('stopTime')
      },
    ]
      //可编辑
      const { dataSource } = this.state;
      const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
      };
      const columns = this.state.work_head.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
          }),
        };
      });
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
                <span style={{color:"red"}}>*</span>LaborPlan No
                <InputGroup size="default" >
                    <Input placeholder="default size" style={{ width: '50%' }} 
                  onChange={(e)=>{
                  this.setState({
                    No:e.target.value
                  })
                }}/>
                </InputGroup>
              </div>

              <div>
                   <span style={{color:"red"}}>*</span>LaborPlan Desc
                   <InputGroup size="default">
                     <Input placeholder="default size" style={{ width: '50%' }} onChange={(e)=>{
                       this.setState({
                         Desc:e.target.value
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
              dataSource={res_data}
            />
            </TabPane>
            <TabPane tab="WorkSpans" key="3">
					<div className="operation_btn" style={{marginBottom:'10px'}}>
            <Button onClick={this.handleAdd} >Add</Button>
              </div>
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
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
      <div className="shift">
         <Button onClick={()=>{
           this.props.history.push('/home/LaborPlan_shift')
         }}>Shifts</Button>
      </div>

      </div>
          <div className="table">
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





