const Rental = require('../models/Rental');
const Car = require('../models/Car');
const User = require('../models/User');

// Create a new rental
exports.createRental = async (req, res) => {
  try {
    const { car_id, customer_id, start_date, end_date } = req.body;

    // Check if the car is available
    const car = await Car.findById(car_id);
    const customer = await User.findById(customer_id);
    if (!car || !customer) {
      if (!car) console.log(`Car : ${car_id}  not found`);
      if (!customer) console.log(`Customer ${customer_id} not found`);
      console.log('Car or customer not found');
      return res.status(404).json({ message: 'Car or customer not found' });
    }
    if (car.status == 'rented' || car.status == 'maintenance') {
      console.log('Car is not available for rental');
      return res.status(400).json({ message: 'Car is not available for rental' });
    }

    // check if the start date is before the end date
    if (new Date(start_date) >= new Date(end_date) && new Date(start_date) >= new Date()) {
      console.log('Invalid rental dates, end date must be higher start date');
      return res.status(400).json({ message: 'Invalid rental dates,end date must be higher start date' });
    }

    // Calculate total cost
    const timeDiff = Math.abs(new Date(end_date) - new Date(start_date));
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const total_cost = diffDays * car.price;

    // Create rental
    const rental = new Rental({
      car_id,
      customer_id,
      start_date,
      end_date,
      total_cost,
      status: 'Chờ duyệt'
    });

    // Save rental
    await rental.save();

    // Update car status to 'rented'
    car.status = 'rented';
    await car.save();

    res.status(201).json({ message: 'Rental created successfully', rental });
  } catch (error) {
    console.error(error);  // Log the full error for debugging
    res.status(500).json({ message: 'Error creating rental', error: error.message });
  }
};// Create a new rental
exports.createRental = async (req, res) => {
    try {
        const { car_id, customer_id, start_date, end_date } = req.body;

        // Kiểm tra nếu customer_id không hợp lệ
        if (!customer_id) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        const car = await Car.findById(car_id);
        const customer = await User.findById(customer_id);

        if (!car || !customer) {
            if (!car) console.log(`Car : ${car_id} not found`);
            if (!customer) console.log(`Customer ${customer_id} not found`);
            return res.status(404).json({ message: 'Car or customer not found' });
        }

        if (car.status === 'rented' || car.status === 'maintenance') {
            console.log('Car is not available for rental');
            return res.status(400).json({ message: 'Car is not available for rental' });
        }

        // Kiểm tra nếu ngày bắt đầu nhỏ hơn ngày kết thúc
        if (new Date(start_date) >= new Date(end_date) || new Date(start_date) < new Date()) {
            return res.status(400).json({ message: 'Invalid rental dates, end date must be higher start date' });
        }

        // Tính toán chi phí
        const timeDiff = Math.abs(new Date(end_date) - new Date(start_date));
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        const total_cost = diffDays * car.price;

        // Tạo rental
        const rental = new Rental({
            car_id,
            customer_id,
            start_date,
            end_date,
            total_cost,
            status: 'Chờ duyệt'
        });

        // Lưu rental
        await rental.save();

        // Cập nhật trạng thái xe
        car.status = 'rented';
        await car.save();

        res.status(201).json({ message: 'Rental created successfully', rental });
    } catch (error) {
        console.error(error);  // Log lỗi chi tiết
        res.status(500).json({ message: 'Error creating rental', error: error.message });
    }
};


// Get all rentals
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find();
    const rentalList = [];

    for (const rental of rentals) {
      const car = await Car.findById(rental.car_id);
      const customer = await User.findById(rental.customer_id);

      // Check if car or customer is not found
      if (!car) {
        console.log('Car with ID', rental.car_id, 'not found');
        // Bỏ qua hợp đồng không có xe
        continue;
      }
      if (!customer) {

        console.log('Customer with ID', rental.customer_id, 'not found');
        // Bỏ qua hợp đồng không có khách hàng
        continue;
      }

      // Format rental data
      const rentalData = {
        _id: rental._id,
        car_id: rental.car_id,
        carInfo: `${car.model} ${car.make} ${car.year}`,
        customer_id: rental.customer_id,
        customerInfo: customer.full_name,
        start_date: rental.start_date,
        end_date: rental.end_date,
        total_cost: rental.total_cost,
        status: rental.status
      };
      rentalList.push(rentalData);
    }

    res.status(200).json(rentalList);
  } catch (error) {
    console.error(error);  // Log the full error for debugging
    res.status(500).json({ message: 'Error fetching rentals', error: error.message });
  }
};



// Get a rental by ID
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      console.log('Rental not found');
      return res.status(404).json({ message: 'Rental not found' });
    }
    const userInfo = await User.findById(rental.customer_id);
    const carInfo = await Car.findById(rental.car_id);
    const rentalData = {
      _id: rental._id,
      car_id: rental.car_id,
      carInfo: `${carInfo.make} ${carInfo.model} ${carInfo.year}`,
      customer_id: rental.customer_id,
      customerInfo: userInfo.full_name,
      start_date: rental.start_date,
      end_date: rental.end_date,
      total_cost: rental.total_cost,
      status: rental.status
    };
    res.status(200).json(rentalData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rental', error: error.message });
  }
};

// Update rental status
exports.updateRentalStatus = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    if (rental.status === 'pending' && req.body.status === 'active') {
      const car = await Car.findById(rental.car_id);
      car.status = 'rented';
      await car.save();
    }
    else {
      const car = await Car.findById(rental.car_id);
      car.status = 'available';
      await car.save();
    }
    rental.status = req.body.status;
    await rental.save();
    res.status(200).json({ message: 'Rental status updated', rental });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating rental', error: error.message });
  }
};

// Delete a rental
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);

    // Update car status to 'available'
    const car = await Car.findById(rental.car_id);
    car.status = 'available';
    await car.save();

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.status(200).json({ message: 'Rental deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting rental', error: error.message });
  }
};

// Get all rentals by customer ID
exports.getRentalsByCustomerId = async (req, res) => {
  try {
    const rentals = await Rental.find({ customer_id: req.params.id });
    const carData = [];
    for (const rental of rentals) {
      const car = await Car.findById(rental.car_id);
      carData.push({
        _id: car._id,
        make: car.make,
        model: car.model,
        year: car.year,
        image: car.image,
        price: car.price,
        start_date: rental.start_date,
        end_date: rental.end_date,
        total_cost: rental.total_cost,
        status: rental.status
      });
    }
    res.status(200).json(carData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals', error: error.message });
  }
};

// Get all rentals by car ID
exports.getRentalsByCarId = async (req, res) => {
  try {
    const rentals = await Rental.find({ car_id: req.params.id });
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals', error: error.message });
  }
}

// Update rental by ID
exports.updateRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(req.params.id)
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    const car = await Car.findById(rental.car_id);
    if (car.status === 'rented') {
      car.status = 'available';
      await car.save();
    }
    const updatedRental = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const carUpdate = await Car.findByIdAndUpdate(updatedRental.car_id, { status: 'rented' }, { new: true });

    res.status(200).json({ message: 'Rental updated successfully', updatedRental });
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating rental', error: error.message });
  }
}


