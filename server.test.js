var superagent = require('superagent')
var expect = require('expect.js')

describe('gather api server', function(){
  var id

  it('post object', function(done){
    superagent.post('http://localhost:3000/collections/test')
      .send({
        description: 'Add address for this location',
        loc: { type: "Point", coordinates: [ -73.97, 40.77 ] },
        adventure: ['addresses']
      })
      .end(function(e,res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.eql(1)
        expect(res.body[0]._id.length).to.eql(24)
        id = res.body[0]._id
        done()
      })
  })

  it('retrieves an object', function(done){
    superagent.get('http://localhost:3000/collections/test/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)
        expect(res.body._id).to.eql(id)
        done()
      })
  })

  it('retrieves a collection', function(done){
    superagent.get('http://localhost:3000/collections/test')
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body.map(function (item){return item._id})).to.contain(id)
        done()
      })
  })

  it('updates an object', function(done){
    superagent.put('http://localhost:3000/collections/test/'+id)
      .send({
        name: 'Peter',
        loc: { type: "Point", coordinates: [ -73.37, 40.17 ] },
      })
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.msg).to.eql('success')
        done()
      })
  })
  it('checks an updated object', function(done){
    superagent.get('http://localhost:3000/collections/test/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)
        expect(res.body._id).to.eql(id)
        expect(res.body.name).to.eql('Peter')
        done()
      })
  })

  it('removes an object', function(done){
    superagent.del('http://localhost:3000/collections/test/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.msg).to.eql('success')
        done()
      })
  })

    it('post 1000 objects', function(done){
      this.timeout(10000);
      for (var i = 1000; i > 0; i--) {
        var lon = ((Math.random() * 360000) / 1000) - 180;
        var lat = ((Math.random() * 180000) / 1000) - 90;
        superagent.post('http://localhost:3000/collections/test')
          .send({
            description: 'Add address for this location',
            loc: { type: "Point", coordinates: [ lon, lat ] },
            adventure: ['addresses']
          })
          .end(function(e,res){
            console.log(res.body)
            expect(e).to.eql(null)
            expect(res.body.length).to.eql(1)
            expect(res.body[0]._id.length).to.eql(24)
            id = res.body[0]._id
          })
      }
      done()
  })

})
