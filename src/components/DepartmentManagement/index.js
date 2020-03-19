import React, { Component } from 'react'
import "./index.css";
import { Table,Button, Input, Icon,Modal,Form,Pagination,message,Select  } from 'antd';
import Highlighter from 'react-highlight-words';
//可拉伸
import { Resizable } from 'react-resizable';
import "react-resizable/css/styles.css";
import axios from 'axios';
const { confirm } = Modal;
const { Option } = Select;

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
//select功能
function onChange(value) {
  console.log(`selected ${value}`);
  console.log(value=this.placeholder)
  console.log(this,'this')
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

const CustomizedForm = Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },

  //from传参
  mapPropsToFields(props) {
    return {
      No: Form.createFormField({
        ...props.No,
        value: props.No.value,
      }),
      Name: Form.createFormField({
        ...props.Name,
        value: props.Name.value,
      }),
      Class: Form.createFormField({
        ...props.Class,
        value: props.Class.value,
      })
    };
  },

  onValuesChange(_, values) {
    console.log(values,'value');
  },
})(props => {
  const { getFieldDecorator } = props.form;
  return (
    <Form layout="inline">
      {/* 弹框内容 */}
      <Form.Item label="Department No">
        {getFieldDecorator('No', {
          rules: [{ required: true, message: 'No is required!' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Department Name">
        {getFieldDecorator('Name', {
          rules: [{ required: false, message: 'Name is required!' }],
        })(<Input />)}
      </Form.Item>
      
      <Form.Item label="Department Class">
        {getFieldDecorator('Class', {
          rules: [{ required: true, message: 'Class is required!' }],
        })(
        <Select 
          showSearch
          optionFilterProp="children"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onSearch={onSearch}
          onChange={onChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        >
          <Option value="0">Manufacturing</Option>
          <Option value="1">Non-Manufacturing</Option>
        </Select>
        )}
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
        axios.delete('/api/Suspend/DelSuspendByIds',{
        data: {Del_List:check_List}
        }).then(res=>{
          if(res.data.success){
            console.log('user删除成功')
            
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

export default class User extends Component {
  constructor(props) {
    super(props)
    const self = this; 
    this.state = {
      dataCount:null,//总条数
      flag:null,
      fields: {
      //*表单状态
        No: {
          value: '',
        },
        Name: {
          value: '',
        },
        Class:{
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
          title: 'Department No.',
          dataIndex: 'depNo',
          width: 130,
          sorter: (a, b) => a.depNo - b.depNo,
          ...self.getColumnSearchProps('depNo'),
        },
        {
          title: 'Department Name.',
          dataIndex: 'depName',
          width: 130,
          sorter: (a, b) => a.depName - b.depName,
          ...self.getColumnSearchProps('depName'),
        },
        {
          title: 'Department Desc',
          dataIndex: 'depDesc',
          width: 130,
          sorter: (a, b) => a.depDesc - b.depDesc,
          ...self.getColumnSearchProps('depDesc'),
        },
        {
          title: 'Department Type',
          dataIndex: 'remarks',
          width: 130,
          sorter: (a, b) => a.remarks - b.remarks,
          ...self.getColumnSearchProps('remarks'),
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
      let {No,Class,Name}=this.state.fields;

      let flag=this.state.flag;
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

      if(No.value,Class.value,Name.value){
        console.log('值都存在')
        if(flag){
          //department添加
          axios.post(`/api/BaseDepartment/DepartmentAdd`,{
            "orgId": localStorage.getItem('orgID'),
            "depNo": No.value,
            "depName": Name.value,
            "remarks": Class.value
          }).then(res=>{
            console.log(res.data.success,"department_add")
            if(res.data.success){
              console.log('department_add成功')
            }else{
            console.log(res.data,'department_add失败')
            }
          })
        }else{
          console.log(check_all[0].key,'edit')
          //department编辑
          axios.post(`/api/BaseDepartment/UptDeptByModel`,{
            "depId": check_all[0].key,
            "workshopId": check_all[0].key,
            "orgId": localStorage.getItem('orgID'),
            "depNo": No.value,
            "depName": Name.value,
            "remarks": Class.value
          }).then(res=>{
            console.log(res.data.success,"department_Edit")
            if(res.data.success){
              console.log('department_Edit成功')
            }else{
            console.log(res.data,'department_Edit失败')
            }
          })
        }
      }else{
        console.log('值不存在')
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

    
    render() {
      const { visible, confirmLoading,fields,pageIndex,pageSize } = this.state;
      
      const date = this.state.columns.map((col, index) => ({
          ...col,
          onHeaderCell: column => ({
            width: column.width,
            onResize: this.handleResize(index),
          }),
        }));
        
      return (
          <div className="box">
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
                      
                        axios.get(`/api/BaseDepartment/GetDepartmentList?orgId=3&pageIndex=${pageIndex}&pageSize=${pageSize}`).then(res=>{
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
                      axios.get(`/api/BaseDepartment/GetDepartmentList?orgId=3&pageIndex=${pageIndex}&pageSize=${pageSize}`).then(res=>{
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
      axios.post('/api/BaseDepartment/GetDepartmentList',{
        "isPagination": true,
        "currentPageNumber": 1,
        "pageSize": 50,
        "sortExpression": [
          "string"
        ],
        "sortDirection": true,
        "searchExpressionList": [
          {
            "searchColumn": "string",
            "searchValue": "string",
            "searchOperator": "string",
            "searchParallel": "string"
          }
        ]
      }).then(res=>{
        console.log(res.data)
        this.data=res.data.data//复制给表格内容
       
        // if(res.data.data.length){
        //   document.querySelector('.ant-table-body').style.maxHeight="450px"
				// }else{                    
        //   document.querySelector('.ant-table-body').style.maxHeight="0"
        // }
      })
    }
   
}





