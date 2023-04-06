import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Produto } from './produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  constructor(private http: HttpClient) {}

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${environment.apiUrl}/produtos`);
  }

  getProduto(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${environment.apiUrl}/produtos/${id}`);
  }

  createProduto(product: Produto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/produtos`, product);
  }

  updateProduto(id: string, product: Produto): Observable<any> {
    return this.http.put(`${environment.apiUrl}/produtos/${id}`, product);
  }

  deleteProduto(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/produtos/${id}`);

  }
}
