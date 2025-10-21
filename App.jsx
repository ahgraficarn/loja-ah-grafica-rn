
import React, { useEffect, useState } from 'react'

const WHATSAPP = '5584998190371' // +55 84 99819-0371
const STORAGE = 'ahgrafica_products_v1'
const ADMIN_EMAIL = 'ahgraficaproducao@gmail.com'
const ADMIN_PASS = 'Canganceir0@@'

function useProducts(){
  const [items,setItems] = useState([])
  useEffect(()=>{
    const raw = localStorage.getItem(STORAGE)
    if(raw){ try{ setItems(JSON.parse(raw)) }catch(e){ console.error(e) } }
    else{
      const seed=[{id:Date.now(),name:'Sacola de Papel - Padrão',price:'3.50',description:'Sacola 23x23cm, papel 120g, impressão frente.',category:'Sacolas',measures:'23x23 cm',material:'Papel 120g',prazo:'4-5 dias úteis',image:null}]
      setItems(seed); localStorage.setItem(STORAGE, JSON.stringify(seed))
    }
  },[])
  useEffect(()=>{ localStorage.setItem(STORAGE, JSON.stringify(items)) },[items])
  return [items,setItems]
}

function Login({onOk}){
  const [email,setEmail]=useState(''); const [pass,setPass]=useState('')
  return (
    <div className="wrap">
      <div className="panel" style={{maxWidth:420, margin:'60px auto'}}>
        <h2>Entrar no Admin</h2>
        <div className="muted" style={{marginBottom:8}}>Use o e-mail cadastrado e a senha.</div>
        <input placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} style={{marginBottom:8}} />
        <input placeholder="Senha" type="password" value={pass} onChange={e=>setPass(e.target.value)} style={{marginBottom:12}} />
        <button className="btn primary" onClick={()=>{
          if(email===ADMIN_EMAIL && pass===ADMIN_PASS){ onOk(true) } else { alert('Acesso negado') }
        }}>Entrar</button>
      </div>
    </div>
  )
}

function App(){
  const [items,setItems]=useProducts()
  const [isAdmin,setIsAdmin]=useState(false)
  const [showLogin,setShowLogin]=useState(false)
  const [editing,setEditing]=useState(null)

  function submit(e){
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = {
      id: editing? editing.id : Date.now(),
      name: fd.get('name')||'Sem nome',
      price: fd.get('price')||'0.00',
      description: fd.get('description')||'',
      category: fd.get('category')||'Geral',
      measures: fd.get('measures')||'',
      material: fd.get('material')||'',
      prazo: fd.get('prazo')||'',
      image: editing? editing.image : null
    }
    const file = fd.get('image')
    if(file && file.size){
      const r = new FileReader()
      r.onload = ()=>{ data.image = r.result; save(data) }
      r.readAsDataURL(file)
    } else { save(data) }
  }
  function save(data){
    if(editing){ setItems(prev=>prev.map(x=>x.id===data.id?data:x)); setEditing(null) }
    else { setItems(prev=>[data,...prev]) }
    document.getElementById('form').reset()
  }
  function whatsappLink(p){
    const text = encodeURIComponent(`Olá, quero pedir: ${p.name} - R$ ${p.price}\nQuantidade:\nEndereço:\nObservações:`)
    return `https://wa.me/${WHATSAPP}?text=${text}`
  }

  return (
    <div>
      <div className="wrap top">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="logo">AH</div>
          <div>
            <div style={{fontWeight:800}}>Loja AH Gráfica RN</div>
            <div className="muted">Sacolas, adesivos, agendas e mais</div>
          </div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <a className="btn" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp</a>
          {isAdmin
            ? <button className="btn" onClick={()=>setIsAdmin(false)}>Sair do Admin</button>
            : <button className="btn" onClick={()=>setShowLogin(true)}>Admin</button>}
        </div>
      </div>

      {showLogin && !isAdmin && <Login onOk={()=>{ setIsAdmin(true); setShowLogin(false) }} />}

      {isAdmin && (
        <div className="wrap panel">
          <h3>Cadastrar/Editar Produto</h3>
          <form id="form" onSubmit={submit}>
            <div className="row">
              <div><input name="name" placeholder="Nome do produto" required /></div>
              <div><input name="price" placeholder="Preço (ex: 9.90)" required /></div>
              <div><input name="category" placeholder="Categoria (ex: Sacolas)" /></div>
              <div><input name="measures" placeholder="Medidas (ex: 23x23 cm)" /></div>
              <div><input name="material" placeholder="Material (ex: Papel 120g)" /></div>
              <div><input name="prazo" placeholder="Prazo (ex: 4-5 dias úteis)" /></div>
            </div>
            <div style={{marginTop:8}}><textarea name="description" placeholder="Descrição" rows="3"></textarea></div>
            <div style={{marginTop:8}}><input name="image" type="file" accept="image/*" /></div>
            <div style={{marginTop:10, display:'flex',gap:8}}>
              <button className="btn primary" type="submit">{editing? 'Salvar alterações':'Adicionar produto'}</button>
              {editing && <button type="button" className="btn" onClick={()=>{ setEditing(null); document.getElementById('form').reset() }}>Cancelar</button>}
            </div>
          </form>
        </div>
      )}

      <div className="wrap">
        <h3 style={{margin:'8px 0'}}>Produtos</h3>
        <div className="grid">
          {items.map(p => (
            <div key={p.id} className="card">
              <div className="img">{p.image ? <img src={p.image} alt={p.name}/> : <div className="muted">Sem imagem</div>}</div>
              <div className="body">
                <div style={{display:'flex',justifyContent:'space-between',gap:8}}>
                  <div>
                    <div style={{fontWeight:700}}>{p.name}</div>
                    <div className="muted">{p.category} • {p.measures}</div>
                  </div>
                  <div className="price">R$ {p.price}</div>
                </div>
                <p className="muted" style={{margin:'6px 0 10px'}}>{p.description}</p>
                <div style={{display:'flex',gap:8}}>
                  <a className="btn primary" href={whatsappLink(p)} target="_blank" rel="noreferrer">Pedir no WhatsApp</a>
                  <button className="btn" onClick={()=>navigator.clipboard?.writeText(window.location.href)}>Compartilhar</button>
                </div>
                <div className="muted" style={{marginTop:8}}>Material: {p.material||'—'} • Prazo: {p.prazo||'—'}</div>
                {isAdmin && (
                  <div style={{marginTop:8, display:'flex', gap:8}}>
                    <button className="btn" onClick={()=>setEditing(p)}>Editar</button>
                    <button className="btn" onClick={()=>setItems(prev=>prev.filter(x=>x.id!==p.id))}>Remover</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer>
        <div className="wrap ft">
          <div>© Loja AH Gráfica RN</div>
          <div>WhatsApp: +55 84 99819-0371</div>
        </div>
      </footer>
    </div>
  )
}

export default App
