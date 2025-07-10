import {
  cn,
  formatFileSize,
  formatDate,
  formatRelativeTime,
  isValidEmail,
  isValidUsername,
  generateId,
  debounce,
  throttle,
  copyToClipboard,
  getFileExtension,
  isValidFileType,
  formatNumber,
  truncateText,
  sleep,
} from '../index'

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('merges class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('handles Tailwind conflicts', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2')
    })

    it('handles empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('', null, undefined)).toBe('')
    })

    it('handles arrays and objects', () => {
      expect(cn(['class1', 'class2'], { class3: true, class4: false })).toBe('class1 class2 class3')
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(500)).toBe('500 Bytes')
      expect(formatFileSize(1023)).toBe('1023 Bytes')
    })

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(2048)).toBe('2 KB')
    })

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB')
    })

    it('formats gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.5 GB')
    })
  })

  describe('formatDate', () => {
    it('formats Date objects correctly', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Dec 25, 2023/)
    })

    it('formats date strings correctly', () => {
      const formatted = formatDate('2023-12-25')
      expect(formatted).toMatch(/Dec 25, 2023/)
    })

    it('handles different date formats', () => {
      const formatted = formatDate('2023-01-01T00:00:00Z')
      expect(formatted).toMatch(/Jan 1, 2023/)
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2023-12-25T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('returns "just now" for recent times', () => {
      const recent = new Date('2023-12-25T11:59:30Z')
      expect(formatRelativeTime(recent)).toBe('just now')
    })

    it('returns minutes ago for times within an hour', () => {
      const thirtyMinutesAgo = new Date('2023-12-25T11:30:00Z')
      expect(formatRelativeTime(thirtyMinutesAgo)).toBe('30m ago')
    })

    it('returns hours ago for times within a day', () => {
      const twoHoursAgo = new Date('2023-12-25T10:00:00Z')
      expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago')
    })

    it('returns days ago for times within a month', () => {
      const threeDaysAgo = new Date('2023-12-22T12:00:00Z')
      expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago')
    })

    it('returns formatted date for older times', () => {
      const twoMonthsAgo = new Date('2023-10-25T12:00:00Z')
      const result = formatRelativeTime(twoMonthsAgo)
      expect(result).toMatch(/Oct 25, 2023/)
    })
  })

  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@invalid.com')).toBe(false)
      expect(isValidEmail('invalid.com')).toBe(false)
      expect(isValidEmail('invalid@.com')).toBe(false)
      expect(isValidEmail('invalid@com')).toBe(false)
    })

    it('handles edge cases', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail(' ')).toBe(false)
      expect(isValidEmail('test @example.com')).toBe(false)
    })
  })

  describe('isValidUsername', () => {
    it('validates correct usernames', () => {
      expect(isValidUsername('user123')).toBe(true)
      expect(isValidUsername('test_user')).toBe(true)
      expect(isValidUsername('user-name')).toBe(true)
      expect(isValidUsername('abc')).toBe(true)
      expect(isValidUsername('a'.repeat(20))).toBe(true)
    })

    it('rejects invalid usernames', () => {
      expect(isValidUsername('ab')).toBe(false) // too short
      expect(isValidUsername('a'.repeat(21))).toBe(false) // too long
      expect(isValidUsername('user@name')).toBe(false) // invalid character
      expect(isValidUsername('user name')).toBe(false) // space
      expect(isValidUsername('user.name')).toBe(false) // dot
    })

    it('handles edge cases', () => {
      expect(isValidUsername('')).toBe(false)
      expect(isValidUsername('123')).toBe(true)
      expect(isValidUsername('___')).toBe(true)
      expect(isValidUsername('---')).toBe(true)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(typeof id2).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
      expect(id2.length).toBeGreaterThan(0)
    })

    it('generates IDs with expected format', () => {
      const id = generateId()
      expect(id).toMatch(/^[a-z0-9]+$/)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('delays function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()
      
      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('passes arguments correctly', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn('arg1', 'arg2')
      jest.advanceTimersByTime(100)
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('limits function execution frequency', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      expect(mockFn).toHaveBeenCalledTimes(1)
      
      jest.advanceTimersByTime(100)
      throttledFn()
      
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('passes arguments correctly', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)
      
      throttledFn('arg1', 'arg2')
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('copyToClipboard', () => {
    it('copies text successfully', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      })
      
      const result = await copyToClipboard('test text')
      
      expect(result).toBe(true)
      expect(mockWriteText).toHaveBeenCalledWith('test text')
    })

    it('handles copy failure', async () => {
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Copy failed'))
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      })
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = await copyToClipboard('test text')
      
      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      
      consoleSpy.mockRestore()
    })
  })

  describe('getFileExtension', () => {
    it('extracts file extensions correctly', () => {
      expect(getFileExtension('file.txt')).toBe('txt')
      expect(getFileExtension('image.jpg')).toBe('jpg')
      expect(getFileExtension('document.pdf')).toBe('pdf')
      expect(getFileExtension('archive.tar.gz')).toBe('gz')
    })

    it('handles files without extensions', () => {
      expect(getFileExtension('filename')).toBe('')
      expect(getFileExtension('.')).toBe('')
    })

    it('handles edge cases', () => {
      expect(getFileExtension('')).toBe('')
      expect(getFileExtension('.hidden')).toBe('')
      expect(getFileExtension('file.')).toBe('')
    })
  })

  describe('isValidFileType', () => {
    it('validates allowed file types', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      expect(isValidFileType(file, ['jpg', 'png', 'gif'])).toBe(true)
    })

    it('rejects disallowed file types', () => {
      const file = new File([''], 'test.exe', { type: 'application/exe' })
      expect(isValidFileType(file, ['jpg', 'png', 'gif'])).toBe(false)
    })

    it('handles case insensitive extensions', () => {
      const file = new File([''], 'test.JPG', { type: 'image/jpeg' })
      expect(isValidFileType(file, ['jpg', 'png', 'gif'])).toBe(true)
    })
  })

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
      expect(formatNumber(999)).toBe('999')
    })

    it('handles negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1,000')
    })

    it('handles decimal numbers', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56')
    })
  })

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long ...')
    })

    it('does not truncate short text', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })

    it('handles exact length', () => {
      const text = 'Exactly twenty chars'
      expect(truncateText(text, 20)).toBe('Exactly twenty chars')
    })

    it('handles edge cases', () => {
      expect(truncateText('', 10)).toBe('')
      expect(truncateText('text', 0)).toBe('...')
    })
  })

  describe('sleep', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('resolves after specified time', async () => {
      const promise = sleep(1000)
      
      jest.advanceTimersByTime(1000)
      
      await expect(promise).resolves.toBeUndefined()
    })

    it('does not resolve before specified time', async () => {
      const promise = sleep(1000)
      let resolved = false
      
      promise.then(() => {
        resolved = true
      })
      
      jest.advanceTimersByTime(500)
      await Promise.resolve() // Allow microtasks to run
      
      expect(resolved).toBe(false)
      
      jest.advanceTimersByTime(500)
      await Promise.resolve()
      
      expect(resolved).toBe(true)
    })
  })
})