import React, { Component } from 'react'
import "./index.css";
import { Table,Button,Form,Pagination,message,Radio,Icon,Modal, DatePicker,Tabs,Input,Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
//可拉伸
import { Resizable } from 'react-resizable';
import "react-resizable/css/styles.css";
import axios from 'axios';
import '../../utils/drag'

const { confirm } = Modal;
const { TabPane } = Tabs;
const InputGroup = Input.Group;
var tag=null;


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

//显示总页数
function showTotal(total) {
return `Total ${total} items`;
}
//警示框
const warning = () => {
  message.warning('Please check the button');
};

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




var check_List=[];//待办列表key
var check_res=[];//资源
var check_all=[];//待办所有列表
function showConfirm() {//删除确认框
  confirm({
    title: 'Do you Want to delete these items?',
    content: 'Some descriptions',
    onOk() {
      console.log(check_List)
        //删除事件
        axios.post('/api/BaseCalendar/DelResByIds',{
            "pId": "10",
            "oIds": check_List
        }).then(res=>{
          if(res.data.success){
            console.log('calendar删除成功')
          }
        })
    },
    onCancel() {
      // console.log('Cancel');
    },
  });
}

//checkbox选中框
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    //selectedRowKeys单个下标 selectedRows整体数组
    check_List=selectedRowKeys;
    check_all=selectedRows
  },
  getCheckboxProps: record => ({
    disabled: record.No === 'Disabled User', // 静用 checked
    No: record.No,
  }),
};
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

export default class User extends Component {
  constructor(props) {
    super(props)
    const self = this; 
    this.state = {
      dataCount:null,//总条数
      flag:null,
      //表单状态
      calName:"",
      StartDate:"",
      endDate:"",
      //分页
      pageIndex:1,
      pageSize:10,
			ModalText: 'Content of the modal',
			visible: false,
			confirmLoading: false,
      searchText: '',
      count:1,
      searchedColumn: '',
      sortedInfo: null,
      columns: [
        {
          title: '',
          dataIndex: 'Edit',
          width: 50,
          render:()=><a>Edit</a>
        },
        // {
        //   title: '',
        //   dataIndex: 'add',
        //   width: 50,
        //   render:()=><a style={{backgroundColor:"red"}}>+</a>
        // },
        {
          title: 'Calendar Desc',
          dataIndex: 'calName',
          width: 200,
          sorter: (a, b) => a.calName.length - b.calName.length,
          ...self.getColumnSearchProps('calName'),
        },
        {
          title: 'Shifts',
          dataIndex: '',
          width: 80,
          render: () => <a>Detail</a>,
        },
        {
          title: 'Start Date',
          dataIndex: 'beginDate',
          width: 150,
          sorter: (a, b) => a.beginDate.length - b.beginDate.length,
          ...self.getColumnSearchProps('beginDate'),
        },
        {
          title: 'Stop Date',
          dataIndex: 'endDate',
          width: 150,
          sorter: (a, b) => a.endDate - b.endDate,
          ...self.getColumnSearchProps('endDate'),
        }
      ],
      //可编辑头
       Shifts_head:[
        {
          title: 'Name',
          dataIndex: 'calGenName',
          key: 'calGenName',
          editable: true,
          ...this.getColumnSearchProps('calGenName'),
        },
        {
          title: 'Week day',
          dataIndex: 'workDay',
          editable: true,
          key: 'workDay',
          ...this.getColumnSearchProps('workDay'),
        },
        {
          title: 'Shift Time',
          dataIndex: 'shift1',
          editable: true,
          key: 'shift1',
          ...this.getColumnSearchProps('shift1'),
        },
        {
          title: ' ',
          dataIndex: 'Del',
          key: 'del',
          // render: () => <Button>Delete</Button>,
          render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
        }
      ],
      //可编辑内容(shift)
       dataSource: []
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
      key: `shift_data${count}`,
      calGenName: 'please enter name',
      workDay: 'please enter Weekday',
      shift1: 'please enter shiftTime',
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


  components = {
      header: {
        cell: ResizeableTitle,
      },
  };
  
  //表格内部数据
    data = []
  //表单时间
    handleFormChange = changedFields => {
      this.setState(({ fields }) => ({
        fields: { ...fields, ...changedFields },
      }));
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
            type="primary"
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

    //from表单
		showModal = (newflag) => {
			this.setState({
        visible: true,
        flag:newflag
      });
      setTimeout(()=>{
        tag=document.getElementsByClassName('ant-modal-content')[0];
      }, 100);
      console.log(tag)
      

		};
    //确定
		handleOk = () => {
      let {flag,calName,StartDate,endDate,dataSource}=this.state;
			this.setState({//转圈
				ModalText: 'The modal will be closed after two seconds',
				confirmLoading: true,
      });
			setTimeout(() => {//延迟关闭
				this.setState({
					visible: false,
					confirmLoading: false,
				});
      }, 800);
      console.log(check_List,'被选中的CheckBox')
        console.log(this.state.dataSource)
        // flag为true添加，false则编辑
        if(flag){
          //添加接口
          axios.post('/api/BaseCalendar/CalAdd',{
            orgId: localStorage.getItem('orgID'),
            resID:check_res,
            calDesc: calName,
            beginDate: StartDate,
            endDate: endDate,
            calGenlist:this.state.dataSource
          }).then(res=>{
            console.log(res.data,'add_user')
            if(res.data.success){
              console.log('calendar添加成功')
              //调用一遍页面  刷新
            }
          })
        }else{
          console.log(check_List,check_res)
          //修改接口
          axios.post('/api/BaseCalendar/UptCalByModel',{
            CalID: check_List[0],
            orgId: localStorage.getItem('orgID'),
            calDesc: calName,
            beginDate: StartDate,
            endDate: endDate,
            resID: check_res,
            calGenlist: dataSource
          }).then(res=>{
            if(res.data.success){
            console.log('calendar修改成功')
            }
          })
        }
    };
    
    //取消
		handleCancel = () => {
			console.log('Clicked cancel button');
			this.setState({
				visible: false,
			});
    };

    //分页显示点击页数
    onChange(pageNumber){
      console.log('Page: ', pageNumber);
      console.log(this.self,5)
    }

    //tab切换(ind)
    callback=(key)=>{
      console.log(key)
      if(key==2){
        axios.post(`/api/BaseCalendar/GetCalById?calId=${check_List}`).then(res=>{
          console.log(res.data.data.calGenlist,'shift')
          this.setState({
            dataSource:res.data.data.calGenlist
          })
        })
      }
    }
    render() {
    //可编辑
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.state.Shifts_head.map(col => {
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

      const {  pageIndex,pageSize } = this.state;
      //res(头部)
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
      const date = this.state.columns.map((col, index) => ({
          ...col,
          onHeaderCell: column => ({
            width: column.width,
            onResize: this.handleResize(index),
          }),
        }));
        
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
                onClick={()=>{
                  console.log(123)
                }}
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
            <TabPane tab="Shift" key="2">
            {/* <Button>
               <Icon type="plus" />
                  Add
            </Button> */}
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
          </TabPane>
        {/* 资源列表 */}
        <TabPane tab="Resource" key="3">
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
              <Table 
                rowSelection={rowSelection}
                bordered 
                size={'small'}
                scroll={{ x: "100%",y: "700px" }}
                components={this.components} 
                columns={date} 
                pagination={false}
                dataSource={this.data}
              />
              </div>
              <div className="Pagination">
                <Pagination
                  showSizeChanger
                  size="small"
                  onShowSizeChange={(current,newSize)=>{//改变当前页
                    // console.log(current,newSize)
                    
                    axios.get(`/api/BaseCalendar/GetCalList?orgId=${localStorage.getItem('orgID')}&pageIndex=${current}&pageSize=${newSize}`
                    ).then(res=>{
                      this.data=res.data.data.data//赋值给表格内容
                      this.setState({
                        dataCount:res.data.data.dataCount,
                        pageSize:newSize
                      })
                    })
                  }}
                  showTotal={showTotal}//总页数展示
                  total={this.state.dataCount}
                  onChange={(pageNumber)=>{//页数改变时
                    console.log(pageNumber,this.state)
                    axios.get(`/api/BaseCalendar/GetCalList?orgId=${localStorage.getItem('orgID')}&pageIndex=${pageNumber}&pageSize=${pageSize}`
                    ).then(res=>{
                      this.data=res.data.data.data//赋值给表格内容
                      this.setState({
                        dataCount:res.data.data.dataCount
                      })
                    })
                  }}
                />
              </div>
            </div>
        )
    }
    componentDidMount(){
      let {pageIndex,pageSize}=this.state;
      //日历表格内容
      axios.post('/api/BaseCalendar/GetCalList',
        {
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
        this.data=res.data.data//复制给表格内容
        console.log(res.data,'日历')
        // this.setState({
        //   dataCount:res.data.data.dataCount
        // })
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
}




