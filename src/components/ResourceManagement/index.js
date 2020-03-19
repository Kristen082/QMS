import React, { Component } from 'react'
import "./index.css";
import { Table,Button, Input, Icon,Modal,Form,Pagination,message,Radio,Select } from 'antd';
import Highlighter from 'react-highlight-words';
import { Link } from "react-router-dom";

//可拉伸
import { Resizable } from 'react-resizable';
import "react-resizable/css/styles.css";
import axios from 'axios';
const { confirm } = Modal;
const { Option } = Select;


//select框
function onChangeSelect(value) {
  console.log(`selected ${value}`);
}
function onBlur() {
  console.log('blur');
}
function onFocus() {
  console.log('focus');
}
function onSearch(val) {
  console.log('search:', val);
}
//显示总页数
function showTotal(total) {
return `Total ${total} items`;
}

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

const CustomizedForm = Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  //from传参
  mapPropsToFields(props) {
    return {
      workcenterno: Form.createFormField({
        ...props.workcenterno,
        value: props.workcenterno.value
      }),
      resourceno: Form.createFormField({
        ...props.resourceno,
        value: props.resourceno.value
      }),
      Resourcedesc: Form.createFormField({
        ...props.Resourcedesc,
        value: props.Resourcedesc.value
      }),
      units: Form.createFormField({
        ...props.units,
        value: props.units.value
      }),
      programmable: Form.createFormField({
        ...props.programmable,
        value: props.programmable.value
      }),
      Resourcecapacity:Form.createFormField({
        ...props.Resourcecapacity,
        value:props.Resourcecapacity.value
      }),
      ResourceType:Form.createFormField({
        ...props.ResourceType,
        value:props.ResourceType.value
      }),
      Available:Form.createFormField({
        ...props.Available,
        value:props.Available.value
      }),
      Department:Form.createFormField({
        ...props.Department,
        value:props.Department.value
      })
    };
  },

  onValuesChange(_, values) {
    console.log(values,'value');
  },
})(props => {
  const { getFieldDecorator } = props.form;
  return (
    <Form layout="inline" style={{border:'1px solid #25a0da' }}>
      <div className="tab_tit">
        <span>General</span>
      </div>
      {/* 表单内容 */}
      <Form.Item label="Work Center No.">
        {getFieldDecorator('workcenterno', {
          rules: [{ required: true, message: 'workcenterno is required!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Resource No">
        {getFieldDecorator('resourceno', {
          rules: [{ required: true, message: 'resourceno is required!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Resource Desc">
        {getFieldDecorator('Resourcedesc', {
          rules: [{ required: false, message: 'Resourcedesc is required!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Units">
        {getFieldDecorator('units', {
          rules: [{ required: true, message: 'units is required!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Programmable">
        {getFieldDecorator('programmable', {
          rules: [{ required: false, message: 'programmable is required!' }],
        })(<Select className="modal_select" style={{ width: 180 }}>
        <Option value="0">No</Option>
        <Option value="1">Yes</Option>
      </Select>)}
      </Form.Item>
      <Form.Item label="Resource Capacity">
        {getFieldDecorator('Resourcecapacity', {
          rules: [{ required: true, message: 'Resourcecapacity is required!'}],
        })(<Select className="modal_select" style={{ width: 180 }}>
          <Option value="-1">Multiple</Option>
          <Option value="0">Infinite</Option>
        </Select>)}
      </Form.Item>
      <Form.Item label="Resource Type">
        {getFieldDecorator('ResourceType', {
          rules: [{ required: true, message: 'ResourceType is required!' }],
        })(<Select className="modal_select" style={{ width: 180 }} disabled>
          <Option value="1">Internal</Option>
          <Option value="2">External</Option>
          <Option value="3">OSP</Option>
        </Select>)}
      </Form.Item>
      <Form.Item label="Available">
        {getFieldDecorator('Available', {
          rules: [{ required: false, message: 'Available is required!' }],
        })(<Select className="modal_select" style={{ width: 180 }}>
          <Option value="0">No</Option>
          <Option value="1">Yes</Option>
        </Select>)}
      </Form.Item>
      <Form.Item label="Department">
        {getFieldDecorator('Department', {
          rules: [{ required: false, message: 'Department is required!' }],
        })(<Select className="modal_select" placeholder="value" style={{ width: 180 }}>
        <Option value="1">Internal</Option>
        <Option value="2">External</Option>
        <Option value="3">OSP</Option>
      </Select>)}
      </Form.Item>
    </Form>
  );
});

//警示框
const warning = () => {
  message.warning('Please check the button');
};

var check_List=[];//待办列表key
var check_all=[];//待办所有列表
function showConfirm() {//删除确认框
  confirm({
    title: 'Do you Want to delete these items?',
    content: 'Some descriptions',
    onOk() {
      console.log(check_List)
        //删除事件
        axios.post(`/api/BaseResource/DelResByIds`,{
          "pId": '10',
          "oIds": check_List
        }).then(res=>{
          if(res.data.success){
            console.log('user删除成功')
            // window.location.reload();调用一遍页面 刷新(有问题)
            
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
    console.log(check_List)
  },
  getCheckboxProps: record => ({
    disabled: record.No === 'Disabled User', // 静用 checked
    No: record.No,
  }),
};

export default class User extends Component {
  constructor(props) {
    super(props)
    const self = this; 
    this.state = {
      dataCount:null,//总条数
      flag:null,
      searchKeyWordDataType:null,//自定义
      fields: {
      //*表单状态
      workcenterno: {
          value: '',
        },
        resourceno: {
          value: '',
        },
        Resourcedesc: {
          value: '',
        },
        units: {
          value: '',
        },
        programmable:{
          value:''
        },
        Resourcecapacity:{
          value:''
        },
        ResourceType:{
          value:''
        },
        Available:{
          value:''
        },
        Department:{
          value:''
        }
      },
      //分页
      pageIndex:1,
      pageSize:10,
			ModalText: 'Content of the modal',
			visible: false,
			confirmLoading: false,
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      columns: [
        {
          title: 'Work Center No.',
          dataIndex: 'workCenterNo',
          width: 200,
          sorter: (a, b) => a.workCenterNo - b.workCenterNo,
          ...self.getColumnSearchProps('workCenterNo'),
        },
        {
          title: 'Resource No.',
          dataIndex: 'resNo',
          width: 150,
          sorter: (a, b) => a.resNo - b.resNo,
          ...self.getColumnSearchProps('resNo'),
        },
        {
          title: 'Resource Desc.',
          dataIndex: 'resDesc',
          width: 150,
          sorter: (a, b) => a.resDesc - b.resDesc,
          ...self.getColumnSearchProps('resDesc'),
        },
        {
          title: 'Department No.',
          dataIndex: 'depNo',
          width: 150,
          sorter: (a, b) => a.depNo - b.depNo,
          ...self.getColumnSearchProps('depNo'),
        },
        {
          title: 'Department Desc',
          dataIndex: 'depDesc',
          width: 150,
          sorter: (a, b) => a.depDesc - b.depDesc,
          ...self.getColumnSearchProps('depDesc'),
        },
        {
          title: 'Units',
          dataIndex: 'units',
          width: 150,
          sorter: (a, b) => a.units - b.units,
          ...self.getColumnSearchProps('units'),
        },{
          title: 'Programmable',
          dataIndex: 'programmable',
          width: 150,
          sorter: (a, b) => a.programmable - b.programmable,
          ...self.getColumnSearchProps('programmable'),
        },{
          title: 'Capacity Type',
          dataIndex: 'capTypeForShow',
          width: 150,
          sorter: (a, b) => a.capTypeForShow - b.capTypeForShow,
          ...self.getColumnSearchProps('capTypeForShow'),
        },{
          title: 'Resource Type',
          dataIndex: 'resType',
          width: 150,
          sorter: (a, b) => a.resType - b.resType,
          ...self.getColumnSearchProps('resType'),
        },{
          title: 'Available',
          dataIndex: 'isAvailable',
          width: 150,
          sorter: (a, b) => a.isAvailable - b.isAvailable,
          ...self.getColumnSearchProps('isAvailable'),
        }
      ]
    }

  }
    
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
		};
    //确定
		handleOk = () => {
      let flag=this.state.flag;
      let {workcenterno,resourceno,Resourcedesc,units,programmable,Resourcecapacity,ResourceType,Available,Department}=this.state.fields;//value框里的状态
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
      console.log(check_all,'被选中的CheckBox')

        console.log('值都存在',workcenterno,resourceno,Resourcedesc)
        // flag为true添加，false则编辑
          //添加接口
          axios.post('/api/BaseResource/ResAdd',
          {
            "workcenterNo": workcenterno.value,
              "resNo": resourceno.value,
              "resDesc": Resourcedesc.value,
              "units": Number(units.value),
              "programmable": Number(programmable.value),   
              "capType": Number(Resourcecapacity.value),        
              "resType": Number(ResourceType.value),       
              "isAvailable": 0,  	
              "depId": Department.value,
              "orgID": localStorage.getItem('orgID')
            }
          ).then(res=>{
            console.log(res.data,'add_resource')
            if(res.data.success){
              console.log('添加成功')
            }
          })
          




      
      
      
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

    // 自定义
    setDataType(value) {
      console.log(value,'111111111')
      this.setState({
        searchKeyWordDataType: value
      });
   }
    
    render() {
      const { visible, confirmLoading,fields,pageIndex,pageSize,searchKeyWordDataType } = this.state;
      
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
							  title="Resource Infromation"
								visible={visible}
								onOk={this.handleOk}
								confirmLoading={confirmLoading}
								onCancel={this.handleCancel}
							>
                <CustomizedForm {...fields} onChange={this.handleFormChange} />
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
              {/* Resource Group */}
              <div>
                <Button onClick={()=>{
                  this.props.history.push('/home/ResourceGroup')
                }}>
                  Resource Group
                </Button>
              </div>
              {/* PLO Resource Group */}
              <div>
                <Button onClick={()=>{
                  this.props.history.push('/home/PLOResourceGroup')
                }}>
                  PLO Resource Group
                </Button>
              </div>
            </div>
						<div className="select_All" style={{margin:"8px 0"}}>
              <div className="selected">
                Process
                  <Select
                    showSearch
                    filterOption={false}
                    optionFilterProp="children"
                    onChange={(value)=>{
                      console.log(value,'onchange')
                      this.setState({
                        processNo:value
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
                  <Option value="lucy">Lucy</Option>
                  {/* {
                    Option_data.map((item,index)=>{
                    return <Option value={item.partNo} key={item.partID} onClick={()=>{
                      console.log(item.partNo,'partNo')
                      this.setState({
                        partNo:item.partNo
                      })
                    }}>{item.partNo}</Option>
                    })
                  } */}
                </Select>
              </div>
              <div className="selected">
                Resource No
              <Select defaultValue="lucy">
                <Option value="lucy">Lucy</Option>
              </Select>
              </div>
              <div className="selected">
                Resource Desc
                <Select defaultValue="lucy">
                  <Option value="lucy">Lucy</Option>
                </Select>
              </div>
              
              <Button  onClick={()=>{
                console.log(this.state)
              }}>Search</Button>
            
            </div>
                <div className="table">
                <Table 
                  rowSelection={rowSelection}
                  bordered 
                  size="small"
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
                    onShowSizeChange={(current,newSize)=>{//size
                      console.log(current,newSize)
                      
                      axios.post('/api/BaseResource/GetResourceList',{
                        "isPagination": true,
                        "currentPageNumber": pageIndex,
                        "pageSize": pageSize,
                        "orgId":10,
                        "sortExpression": [],
                        "sortDirection": true,
                        "searchExpressionList": []}
                      ).then(res=>{
                        this.data=res.data.data.data//赋值给表格内容
                        this.setState({
                          dataCount:res.data.totalRows,
                          pageSize:newSize
                        })
                      })
                    }}
                    showTotal={showTotal}//总页数展示
                    total={this.state.dataCount}
                    onChange={(pageNumber)=>{//页数
                      console.log(pageNumber,111111)
                      axios.post('/api/BaseResource/GetResourceList',{
                        "isPagination": true,
                        "currentPageNumber": pageIndex,
                        "pageSize": pageSize,
                        "orgId":10,
                        "sortExpression": [],
                        "sortDirection": true,
                        "searchExpressionList": []}).then(res=>{
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
          this.data=res.data.data//复制给表格内容
          this.setState({
            dataCount:res.data.totalRows
          })
      })
    }
    
   
}




