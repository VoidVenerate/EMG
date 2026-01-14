import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from '../Modal/Modal'
import { Mail, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import './Newsletter.css'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const BASE_URL = 'https://exodus-va6e.onrender.com'

const Newsletter = () => {
  const [subscriptionsList, setSubscriptionsList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: '',
    message: '',
    subMessage: '',
    type: '',
  })

  // Fetch all subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/newsletter/subscriptions`)
        setSubscriptionsList(res.data || [])
      } catch (error) {
        console.error(error)
        setModalInfo({
          show: true,
          title: 'Error!',
          message: 'Failed to fetch newsletter subscriptions.',
          subMessage: '',
          type: 'error',
        })
      }
    }

    fetchSubscriptions()
  }, [])

  // Pagination
  const totalPages = Math.ceil(subscriptionsList.length / itemsPerPage)

  const paginatedList = subscriptionsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  // Export to Excel
  const exportSubscribersToExcel = () => {
    if (subscriptionsList.length === 0) {
      setModalInfo({
        show: true,
        title: 'No Data',
        message: 'There are no subscribers to export.',
        subMessage: '',
        type: 'duration',
      })
      return
    }

    const formattedData = subscriptionsList.map(sub => ({
      Email: sub.email,
      Subscribed_At: new Date(sub.subscribed_at).toLocaleString(),
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscribers')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const file = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    })

    saveAs(file, 'newsletter_subscribers.xlsx')
    
    setModalInfo({
      show: true,
      title: 'Success!',
      message: 'Subscriber list downloaded successfully.',
      subMessage: '',
      type: 'success',
    })
  }

  return (
    <div className="subscription-container">
      {modalInfo.show && (
        <Modal
          show={modalInfo.show}
          title={modalInfo.title}
          message={modalInfo.message}
          subMessage={modalInfo.subMessage}
          type={modalInfo.type}
          onClose={() => setModalInfo(prev => ({ ...prev, show: false }))}
          footerButtons={
            <button 
              className="modal-close-btn-primary" 
              onClick={() => setModalInfo(prev => ({ ...prev, show: false }))}
            >
              Close
            </button>
          }
        />
      )}

      {/* Header Section */}
      <div className="newsletter-header">
        <h1 className="newsletter-title">Newsletter Subscribers</h1>
        <p className="newsletter-subtitle">Manage and export your subscriber list</p>
      </div>

      {/* Stats Card */}
      <div className="dashboard-card" style={{marginLeft:'3vw'}}>
        <div className="card-icon">
          <Mail size={24} />
        </div>
        <h3>Total Subscribers</h3>
        <p className="subscriber-count">{subscriptionsList.length}</p>
        <span className="hr-spans"></span>
        <button className="download-btn" onClick={exportSubscribersToExcel}>
          <Download size={16} />
          Download Report
        </button>
      </div>

      {/* Subscribers List */}
      <div className="newsletter-list">
        <div className="list-header">
          <h3 className="list-title">
            Subscriber List <span className="count-badge">{subscriptionsList.length}</span>
          </h3>
        </div>

        <div className="notification-list">
          {paginatedList.length > 0 ? (
            paginatedList.map((sub, index) => (
              <div key={index} className="subscriber-item">
                <div className="subscriber-info">
                  <Mail size={16} className="email-icon" />
                  <p className="subscriber-email">{sub.email}</p>
                </div>
                <p className="subscriber-date">
                  {new Date(sub.subscribed_at).toLocaleDateString()}
                </p>
                <hr className="notification-hr" />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Mail size={48} className="empty-icon" />
              <p>No subscribers found yet.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {subscriptionsList.length > itemsPerPage && (
          <div className="pagination-controls">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="pagination-btn"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="pagination-btn"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Newsletter