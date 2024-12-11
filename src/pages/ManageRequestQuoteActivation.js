import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import $ from 'jquery';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'daterangepicker/daterangepicker.css'; // Import daterangepicker CSS
import 'daterangepicker'; // Import daterangepicker JS
import moment from 'moment';
import 'select2/dist/css/select2.css';
import 'select2';
import CustomLoader from '../components/CustomLoader';
import { RefreshCcw,Filter} from 'lucide-react';
import QueryDetails from './QueryDetails';
import { AnimatePresence, motion } from 'framer-motion';



const RequestQuoteActivation = () => {
    const [quotes, setQuotes] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('')
    const [loading, setLoading] = useState(false);
    const selectUserRef = useRef(null);
    const [selectedQuery, setSelectedQuery] = useState('');
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    DataTable.use(DT);


    const toggleDetailsPage = () => {
        setIsDetailsOpen(!isDetailsOpen);
    };
    const handleViewButtonClick = (query) => {
        setSelectedQuery(query);
        setIsDetailsOpen(true);
    };

    useEffect(() => {
        // Initialize select2 for Select Team
        $(selectUserRef.current).select2({
            placeholder: "Select User",
            allowClear: true,
        }).on('change', (e) => {
            setSelectedUser($(e.target).val());
        });


        return () => {
            // Destroy select2 when the component unmounts
            if (selectUserRef.current) {
                 $(selectUserRef.current).select2('destroy');
            }
        };
    }, [users]);

    // Fetch all data on initial render
    useEffect(() => {
        fetchQuotes();

        // Initialize the date range picker on component mount
        $('#filterDate').daterangepicker(
            {
                locale: {
                    format: 'MM/DD/YYYY',
                },
                startDate: moment().startOf('month'),
                endDate: moment().endOf('month'),
            },
            function (start, end, label) {
                setFilterDate(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
            }
        );

    }, []);

    const fetchQuotes = async () => {
        setLoading(true); // Show loading spinner
        const userid = selectedUser;
        const filter_date = filterDate;
        const search_keywords = keyword;
        
        try {
            const response = await fetch(
                'https://instacrm.rapidcollaborate.com/api/listaskforscope',
                {
                    method: 'POST', // Use POST method
                    headers: {
                        'Content-Type': 'application/json', // Set content type to JSON
                    },
                    body: JSON.stringify({ userid, filter_date,search_keywords ,status }), // Pass the POST data as JSON
                }
            );
    
            const data = await response.json(); // Parse the response as JSON
            if (data.status) {
                setQuotes(data.allQuoteData); // Update the quotes state
                setUsers(data.crmUserData);
            } else {
                console.error('Failed to fetch quotes:', data.message);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };
    

    const columns = [
        {
            title: 'Sr. No.',
            data: null,
            orderable: false,
            render: (data, type, row, meta) => {
                return `<div style="text-align: center;">${meta.row + 1}</div>`;
            },
        },
        {
            title: 'Ref Id',
            data: 'ref_id',
            orderable: true,
        },
        {
            title: 'UserNme',
            data: 'name',
            orderable: false,
            render: (data) => `<div style="text-align: left;">${data}</div>`,
        },
        {
            title: 'Client Name',
            data: 'client_name',
            orderable: false,
            render: (data) => `<div style="text-align: left;">${data}</div>`,
        },
        {
            title: 'Email',
            data: 'client_email',
            orderable: false,
            render: (data) => `<div style="text-align: left;">${data || 'N/A'}</div>`,
        },
        {
            title: 'Status',
            data: 'task_status',
            orderable: false,
            render: (data, type,row) => `<div style="text-align: left;color:${row.task_status_color}">${data}</div>`,
        },
        {
            title: 'Created Date',
            data: 'created_date',
            orderable: false,
            render: (data) => {
                return data ? new Date(data * 1000).toLocaleDateString() : 'N/A';
            },
        },
        {
            title: 'Actions',
            data: null,
            orderable: false,
            render: (data, type, row) => `
        <button class="view-btn vd mx-1 p-1  text-white" style="font-size:10px;border-radius:3px;" data-id="${row.ref_id}">
            View Details
        </button>
      `,
        },
    ];

    const resetFilters = () => {
        setFilterDate('');
        setKeyword('');
        setSelectedUser('');
        setStatus('')
        $(selectUserRef.current).val(null).trigger('change');
        fetchQuotes();  // Fetch unfiltered data
    };

    return (
        <div className="container bg-gray-100 w-full">
            <h1 className='text-xl font-bold'>All Quote List</h1>

            {/* Filter Section */}
            <div className="flex items-center space-x-2 my-3 bg-white px-4 py-2 rounded aql">
                <div className="w-1/2">
                    <input
                        id="filterDate"
                        type="text"
                        className="form-control"
                        placeholder="From Date - To Date"
                        value={filterDate}
                        readOnly // Make the input read-only as it's controlled by daterangepicker
                    />
                </div>
                <div className="w-1/2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder='Enter Search Keywords'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="w-1/2">
                    <select
                        id="user_id"
                        className=" px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 form-control"

                        value={selectedUser}
                        ref={selectUserRef}
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-1/2 ss">
                    
                    <select
                        className="form-control"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="1">Price Submitted</option>
                    </select>
                </div>
                <div className="w-1/2 flex justify-content-end space-x-2 mt-1">
                    <label>&nbsp;</label>
                    <button className="gree text-white mr-2 flex items-center" onClick={fetchQuotes}>
                    <Filter size={12}/> &nbsp;
                        Apply Filters
                    </button>
                    <button className="bg-gray-200 text-gray-500  hover:bg-gray-300 ic" onClick={resetFilters}>
                        <RefreshCcw size={12}/>
                    </button>

                </div>
            </div>

            {loading ? (
                <CustomLoader />
            ) : (
                <div className='bg-white dt border-t-2 border-blue-400 rounded'>
                    <div className="table-scrollable">
                <DataTable
                    data={quotes}
                    columns={columns}
                    options={{
                        pageLength: 50,
                        createdRow: (row, data) => {
                            $(row).find('.view-btn').on('click', () => handleViewButtonClick(data));
                        },
                    }}
                />
                </div>
                </div>
            )}

            <AnimatePresence>
                

                {isDetailsOpen && (
                   
                        <QueryDetails
                            onClose={toggleDetailsPage}
                            
                            queryId={selectedQuery}
                        />
                    
                )}
            </AnimatePresence>
           
        </div>
    );
};

export default RequestQuoteActivation;
